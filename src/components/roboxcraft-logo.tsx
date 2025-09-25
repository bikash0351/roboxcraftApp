import { cn } from "@/lib/utils";

export const RoboxcraftLogo = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-8 w-8", className)}
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="white" fontWeight="bold">R</text>
        </svg>
    );
};
