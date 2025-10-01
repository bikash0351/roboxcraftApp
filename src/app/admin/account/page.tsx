
"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut } from "lucide-react";

const accountSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export default function AdminAccountPage() {
    const { admin, loading } = useAdminAuth();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            username: "roboxcraft",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!loading && !admin) {
            router.replace('/admin/login');
        }
    }, [admin, loading, router]);


    function onSubmit(values: z.infer<typeof accountSchema>) {
        // In a real app, you would have an API call to update the credentials.
        // For this demo, we'll just show a toast message.
        console.log(values);
        toast({
            title: "Account Updated",
            description: "Your username and password have been updated.",
        });
        form.reset({
            username: values.username,
            password: "",
            confirmPassword: "",
        });
    }

    if (loading || !admin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex w-full flex-col">
             <Card>
                <CardHeader>
                    <CardTitle>Update Credentials</CardTitle>
                    <CardDescription>Change your admin username and password here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                <Input placeholder="roboxcraft" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="Leave blank to keep current" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Account
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
