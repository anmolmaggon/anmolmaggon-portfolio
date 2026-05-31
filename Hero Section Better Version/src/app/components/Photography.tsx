import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HoverLink } from "./HoverLink";

const shots = [
  "https://images.unsplash.com/photo-1614546932435-ab58a5d109f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  "https://images.unsplash.com/photo-1523313807199-5e21483ad3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  "https://images.unsplash.com/photo-1654127039389-bc352446747b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  "https://images.unsplash.com/photo-1701402276738-b167cdbf6c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  "https://images.unsplash.com/photo-1567601169793-64703dc5324a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
];

export function Photography() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-40">
      <div className="flex items-baseline justify-between mb-12">
        <p className="eyebrow">Photography</p>
        <HoverLink href="#" className="italic text-[15px]">
          See full archive →
        </HoverLink>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {shots.map((src, i) => (
          <div
            key={src}
            className={`relative overflow-hidden bg-black/5 ${
              i === 0 ? "col-span-2 md:col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-square"
            }`}
          >
            <ImageWithFallback src={src} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
