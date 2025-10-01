
"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AppUser {
    id: string;
    email: string | null;
    displayName: string | null;
    lastSeen: Date | null;
}

export default function AdminUsersPage() {
    const { admin, loading } = useAdminAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !admin) {
            router.replace('/admin/login');
        }
    }, [admin, loading, router]);


    useEffect(() => {
        const fetchUsers = async () => {
             if (admin) {
                setDataLoading(true);
                // This is a simplified approach. In a real-world scenario, you would have a dedicated 'users'
                // collection that gets populated when a user signs up.
                // For this demo, we'll derive the user list from the 'orders' collection.
                try {
                    const ordersQuery = query(collection(db, "orders"));
                    const querySnapshot = await getDocs(ordersQuery);
                    
                    const uniqueUsers = new Map<string, AppUser>();

                    querySnapshot.docs.forEach(doc => {
                        const orderData = doc.data();
                        if (orderData.userId && !uniqueUsers.has(orderData.userId)) {
                            uniqueUsers.set(orderData.userId, {
                                id: orderData.userId,
                                // These fields are not in the order, so they are placeholders.
                                // A real 'users' collection would have this info.
                                email: `user_${orderData.userId.substring(0, 5)}@example.com`, 
                                displayName: 'N/A',
                                lastSeen: orderData.createdAt.toDate(),
                            });
                        }
                    });

                    setUsers(Array.from(uniqueUsers.values()));
                } catch (error) {
                    console.error("Error fetching users:", error);
                } finally {
                    setDataLoading(false);
                }
            }
        };

        fetchUsers();
    }, [admin]);


    if (loading || dataLoading ||!admin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>A list of users who have placed orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                        {users.map(user => (
                            <li key={user.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.displayName} ({user.id.substring(0, 7)})</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Last Active</p>
                                    <p className="text-sm text-gray-700">{user.lastSeen?.toLocaleDateString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No users found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
