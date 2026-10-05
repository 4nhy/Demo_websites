import Image from "next/image";

/**
 * Static render of the same procedural model, captured from /studio. Shown
 * below tablet width, without WebGL2, or under reduced motion; hidden by CSS
 * (html[data-scene="3d"]) when the live scene owns the stage.
 */
export default function Still({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`scene-still relative ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
    </div>
  );
}
