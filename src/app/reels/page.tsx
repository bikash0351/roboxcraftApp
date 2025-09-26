import { ReelPlayer } from "@/components/reel-player";
import { reels } from "@/lib/data";

export default function ReelsPage() {
  return (
    <div className="h-dvh snap-y snap-mandatory overflow-y-auto">
      {reels.map((reel) => (
        <div key={reel.id} className="h-full w-full flex-shrink-0 snap-start relative">
          <ReelPlayer reel={reel} />
        </div>
      ))}
    </div>
  );
}
