
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
            <h1 className="font-headline text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-muted-foreground max-w-md">
                Your order has been placed successfully. We've sent a confirmation email to you. You can track your order status in your account.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/account">Go to My Account</Link>
                </Button>
            </div>
        </div>
    );
}
