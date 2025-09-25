import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { ChevronRight, LogOut, MapPin, Package } from "lucide-react";

export default function AccountPage() {
    const userImage = placeholderImages.find(p => p.id === 'user-avatar');

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                <Avatar className="h-24 w-24">
                    {userImage && <AvatarImage src={userImage.imageUrl} alt="User Avatar" data-ai-hint={userImage.imageHint} />}
                    <AvatarFallback>RR</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="font-headline text-3xl font-bold">Robo Rick</h1>
                    <p className="text-muted-foreground">rick@robomart.dev</p>
                </div>
            </div>

            <Separator className="my-8" />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <button className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="flex items-center gap-4">
                            <Package className="h-6 w-6" />
                            <span className="font-medium">My Orders</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <Separator />
                    <button className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="flex items-center gap-4">
                            <MapPin className="h-6 w-6" />
                            <span className="font-medium">My Addresses</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <Separator />
                    <button className="flex w-full items-center justify-between rounded-lg p-4 text-left text-destructive transition-colors hover:bg-destructive/10">
                        <div className="flex items-center gap-4">
                            <LogOut className="h-6 w-6" />
                            <span className="font-medium">Logout</span>
                        </div>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
