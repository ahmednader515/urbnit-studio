import type { HomepageSetting } from "@/lib/types";
import { parseImageUrlArray } from "@/lib/homepage-urbnit";

export function HomeTopBanner({ settings }: { settings: HomepageSetting }) {
  const images = parseImageUrlArray(settings.topBannerImages, 12);
  if (images.length === 0) return null;

  // Repeat so a short list still fills the strip on wide screens
  const strip = images.length >= 8 ? images : [...images, ...images, ...images].slice(0, 12);

  return (
    <div className="overflow-hidden border-b border-neutral-100 bg-white" aria-hidden>
      <div className="urbnit-banner-track flex w-max">
        {[...strip, ...strip].map((src, i) => (
          <div key={`${src}-${i}`} className="h-16 w-28 shrink-0 sm:h-20 sm:w-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
