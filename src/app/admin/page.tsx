
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { CartItem } from "@/components/cart-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, DollarSign, Users, ShoppingCart, MoreHorizontal, Trash2, Edit, Eye, LogOut } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RoboxcraftLogo } from "@/components/roboxcraft-logo";


interface Order {
    id: string;
    createdAt: Timestamp;
    total: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    items: CartItem[];
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export default function AdminDashboardPage() {
    const { admin, logout, loading: authLoading } = useAdminAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !admin) {
            router.replace('/admin/login');
        }
    }, [admin, authLoading, router]);

    const fetchData = async () => {
        if (admin) {
            setLoading(true);
            try {
                // Fetch Orders
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const ordersQuery = query(
                    collection(db, "orders"),
                    where("createdAt", ">=", Timestamp.fromDate(today)),
                    where("createdAt", "<", Timestamp.fromDate(tomorrow))
                );
                const allOrdersQuery = query(collection(db, "orders"));

                const [querySnapshot, allOrdersSnapshot] = await Promise.all([
                    getDocs(ordersQuery),
                    getDocs(allOrdersSnapshot)
                ]);
                
                const recentOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(recentOrders);

                setTotalOrders(allOrdersSnapshot.size);
                const totalEarning = allOrdersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
                setTotalRevenue(totalEarning);

                // This is a simplified way to get users. In a real app, you might have a dedicated 'users' collection.
                const userIds = new Set(allOrdersSnapshot.docs.map(doc => doc.data().userId));
                setTotalUsers(userIds.size);

            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [admin]);

    const handleDelete = async (orderId: string) => {
        try {
            await deleteDoc(doc(db, "orders", orderId));
            setOrders(orders.filter(order => order.id !== orderId));
            fetchData(); // Refresh totals
        } catch (error) {
            console.error("Error deleting order: ", error);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: status });
            setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
        } catch (error) {
            console.error("Error updating order status: ", error);
        }
    };


    if (authLoading || loading || !admin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    const totalStock = 'N/A'; // Placeholder

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
           <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
                <div className="flex items-center gap-2">
                    <RoboxcraftLogo className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
                </div>
                 <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </header>
            <main className="flex-1 p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{totalOrders}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{totalUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStock}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent Orders (Today)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Order Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id.slice(0, 7)}</TableCell>
                                            <TableCell>{order.fullName}</TableCell>
                                            <TableCell>{`${order.address}, ${order.city}`}</TableCell>
                                            <TableCell>{new Date(order.createdAt.seconds * 1000).toLocaleTimeString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="capitalize">{order.status}</Badge>
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
                                                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem onSelect={() => handleUpdateStatus(order.id, 'shipped')}><Edit className="mr-2 h-4 w-4" />Mark as Shipped</DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => handleUpdateStatus(order.id, 'delivered')}><Edit className="mr-2 h-4 w-4" />Mark as Delivered</DropdownMenuItem>
                                                        
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the order.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(order.id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">No recent orders today.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
