import { RoboxcraftLogo } from "./roboxcraft-logo";
import { MapPin, Phone, Mail } from "lucide-react";

export function ContentFooter() {
    return (
        <footer className="bg-secondary text-secondary-foreground">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2">
                            <RoboxcraftLogo className="h-10 w-10" />
                            <span className="font-headline text-2xl font-bold">RoboXCraft</span>
                        </div>
                        <p className="mt-2 text-sm">We Sell Robotic Project Kits.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-headline font-semibold tracking-wider">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+91-9304912261</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <Mail className="h-4 w-4" />
                                <span>contact@roboxcraft.com</span>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-headline font-semibold tracking-wider">Address</h3>
                        <div className="flex items-start justify-center md:justify-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p>Nitte Meenakshi Institute Of Technology, Bangalore</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-secondary-foreground/20 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} RoboXCraft. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
