
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
import { type Product } from "@/lib/data";
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
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  category: z.enum(["Kits", "Components"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock can't be negative"),
  imageUrl: z.string().optional(),
});

type ProductWithId = Product & { firestoreId: string };

export default function AdminProductsPage() {
    const { admin, loading: adminLoading } = useAdminAuth();
    const router = useRouter();
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithId | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            category: "Kits",
            price: 0,
            originalPrice: undefined,
            stock: 0,
            imageUrl: "",
        },
    });
     
    const fetchProducts = async () => {
        setDataLoading(true);
        try {
            const productsQuery = query(collection(db, "products"), orderBy("name"));
            const querySnapshot = await getDocs(productsQuery);
            const productsData = querySnapshot.docs.map(doc => ({ 
                firestoreId: doc.id,
                ...doc.data() 
            } as ProductWithId));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({ variant: "destructive", title: "Failed to fetch products" });
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (!adminLoading && !admin) {
            router.replace('/admin/login');
        } else if (admin) {
            fetchProducts();
        }
    }, [admin, adminLoading, router]);

    const handleDialogOpen = (product: ProductWithId | null = null) => {
        setSelectedProduct(product);
        setImageFile(null);
        if (product) {
            form.reset({
                ...product,
                originalPrice: product.originalPrice || undefined,
            });
        } else {
            form.reset({
                name: "",
                category: "Kits",
                price: 0,
                originalPrice: undefined,
                stock: 0,
                imageUrl: "",
            });
        }
        setDialogOpen(true);
    };

    const handleDeleteAlertOpen = (product: ProductWithId) => {
        setSelectedProduct(product);
        setDeleteAlertOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        setIsUploading(true);
        let imageUrl = values.imageUrl || '';

        try {
            if (imageFile) {
                const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            
            const productData = { ...values, imageUrl };

            if (selectedProduct) { // Editing
                const productRef = doc(db, "products", selectedProduct.firestoreId);
                await updateDoc(productRef, productData);
                toast({ title: "Product Updated", description: `${values.name} has been updated.` });
            } else { // Adding
                await addDoc(collection(db, "products"), {
                    ...productData,
                    id: `prod-${Date.now()}`,
                    imageIds: ['ai-product'],
                });
                toast({ title: "Product Added", description: `${values.name} has been added.` });
            }
            fetchProducts(); // Refresh data
            setDialogOpen(false);
        } catch (error) {
            console.error("Error saving product: ", error);
            toast({ variant: "destructive", title: "Save Failed", description: "Could not save product to the database." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await deleteDoc(doc(db, "products", selectedProduct.firestoreId));
            toast({ title: "Product Deleted", description: `${selectedProduct.name} has been deleted.` });
            fetchProducts(); // Refresh data
            setDeleteAlertOpen(false);
        } catch (error) {
            console.error("Error deleting product: ", error);
            toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete product." });
        }
    };

    const isLoading = adminLoading || dataLoading;

    if (isLoading || !admin) {
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
                                                    <Input type="number" placeholder="e.g., 59.99" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormItem>
                                    <FormLabel>Product Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                    </FormControl>
                                     <FormDescription>
                                        Upload a new image for the product. If not provided, a default image will be used.
                                    </FormDescription>
                                </FormItem>
                            </form>
                        </Form>
                        <DialogFooter>
                            <Button type="submit" form="product-form" disabled={form.formState.isSubmitting || isUploading}>
                                {(form.formState.isSubmitting || isUploading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length > 0 ? products.map(product => {
                                const productImage = PlaceHolderImages.find(p => p.id === (product.imageIds && product.imageIds[0] || 'ai-product'));
                                const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                                return (
                                <TableRow key={product.firestoreId}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                            alt={product.name}
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={product.imageUrl || productImage?.imageUrl || "https://placehold.co/64x64"}
                                            width="64"
                                        />
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
                                    <TableCell>{product.stock}</TableCell>
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
                            )}) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No products found. Add your first product!
                                    </TableCell>
                                </TableRow>
                            )}
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

    