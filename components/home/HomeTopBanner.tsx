import type { HomepageSetting } from "@/lib/types";
import { parseImageUrlArray } from "@/lib/homepage-urbnit";

export function HomeTopBanner({ settings }: { settings: HomepageSetting }) {
  const images = parseImageUrlArray(settings.topBannerImages, 12);
  if (images.length === 0) return null;

  return (
    <div className="overflow-hidden border-y border-neutral-100 bg-white">
      <div className="flex">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="h-16 w-28 shrink-0 sm:h-20 sm:w-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover opacity-80" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
