
"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products as initialProducts, type Product } from "@/lib/data";
import { Loader2, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  category: z.enum(["Kits", "Components"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  originalPrice: z.coerce.number().optional(),
  imageIds: z.array(z.string()).optional(), // For simplicity, we won't edit images in this form
});

export default function AdminProductsPage() {
    const { admin, loading } = useAdminAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            category: "Kits",
            price: 0,
            originalPrice: undefined,
        },
    });

    useEffect(() => {
        if (!loading && !admin) {
            router.replace('/admin/login');
        }
    }, [admin, loading, router]);

    const handleDialogOpen = (product: Product | null = null) => {
        setSelectedProduct(product);
        if (product) {
            form.reset(product);
        } else {
            form.reset({
                name: "",
                category: "Kits",
                price: 0,
                originalPrice: undefined,
            });
        }
        setDialogOpen(true);
    };

    const handleDeleteAlertOpen = (product: Product) => {
        setSelectedProduct(product);
        setDeleteAlertOpen(true);
    };

    const onSubmit = (values: z.infer<typeof productSchema>) => {
        // In a real app, you would save this to your database.
        if (selectedProduct) { // Editing
            setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...values } : p));
            toast({ title: "Product Updated", description: `${values.name} has been updated.` });
        } else { // Adding
            const newProduct: Product = { ...values, id: `prod-${Date.now()}`, imageIds: ['kit-arduino'] }; // Dummy image
            setProducts([newProduct, ...products]);
            toast({ title: "Product Added", description: `${values.name} has been added.` });
        }
        setDialogOpen(false);
    };

    const handleDelete = () => {
        if (!selectedProduct) return;
        // In a real app, you would delete this from your database.
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        toast({ title: "Product Deleted", description: `${selectedProduct.name} has been deleted.` });
        setDeleteAlertOpen(false);
    };

    if (loading || !admin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleDialogOpen()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            <DialogDescription>
                                {selectedProduct ? 'Update the details of your product.' : 'Fill in the details for the new product.'}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Arduino Uno R3" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Kits">Kits</SelectItem>
                                            <SelectItem value="Components">Components</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (₹)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 39.99" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="originalPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Original Price (₹)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 59.99" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>
                        <DialogFooter>
                            <Button type="submit" form="product-form">
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {selectedProduct ? 'Save Changes' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>Manage your products here. View, edit, or delete them.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map(product => {
                                const productImage = PlaceHolderImages.find(p => p.id === product.imageIds[0]);
                                const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                                return (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {productImage && 
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={productImage.imageUrl}
                                                width="64"
                                            />
                                        }
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>₹{product.price.toFixed(2)}</span>
                                            {hasDiscount && <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice?.toFixed(2)}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleDialogOpen(product)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAlertOpen(product)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            &quot;{selectedProduct?.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

    