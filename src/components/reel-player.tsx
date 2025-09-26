
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Reel } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Heart, MessageCircle, Send } from "lucide-react";

interface ReelPlayerProps {
    reel: Reel;
}

// This is a mock video player. In a real app, you'd use a video library.
const MockVideoPlayer = ({ reel }: { reel: Reel }) => {
    return (
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
            <div className="w-full aspect-[9/16] bg-cover bg-center" style={{backgroundImage: `url(https://picsum.photos/seed/${reel.id}/720/1280)`}} data-ai-hint="robot video">
                 <div className="w-full h-full bg-black/30" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg className="h-20 w-20 text-white/50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            </div>
        </div>
    );
};


export function ReelPlayer({ reel }: ReelPlayerProps) {
    const userImage = placeholderImages.find(p => p.id === reel.user.imageId);

    return (
        <div className="h-full w-full relative bg-black flex items-center justify-center">
            <div className="relative w-full aspect-[9/16] max-h-full">
                <MockVideoPlayer reel={reel} />

                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-20 text-white bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10 border-2 border-white">
                                    {userImage && <AvatarImage src={userImage.imageUrl} alt={reel.user.name} data-ai-hint={userImage.imageHint} />}
                                    <AvatarFallback>{reel.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold">{reel.user.name}</span>
                            </div>
                            <p className="mt-2 text-sm">{reel.description}</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10 hover:text-white">
                                <Heart className="h-7 w-7" />
                                <span className="text-xs">{reel.likes}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10 hover:text-white">
                                <MessageCircle className="h-7 w-7" />
                                <span className="text-xs">{reel.comments}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10 hover:text-white">
                                <Send className="h-7 w-7" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
