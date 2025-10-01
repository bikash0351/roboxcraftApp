
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyAddressesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login?redirect=/account/addresses');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // In a real app, you would fetch and display addresses here.
    const addresses: any[] = []; 

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-primary" />
                    <h1 className="font-headline text-3xl font-bold">My Addresses</h1>
                </div>
                <Button className="mt-4 sm:mt-0">
                    <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
            </div>
            
            {addresses.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <MapPin className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-6 text-xl font-semibold">No Saved Addresses</h2>
                    <p className="mt-2 text-muted-foreground">You haven't saved any addresses yet. Add one now!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">Address {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{address.fullName}</p>
                                <p>{address.address}</p>
                                <p>{address.city}, {address.postalCode}</p>
                                <p>{address.country}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
