export type LogoVariant = "color" | "monochrome";

/** Preview asset prepared from the supplied logo; both views share its shape. */
export function BrandLogo({ variant = "color", className = "" }: { variant?: LogoVariant; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/media/brand/sail-lore-preview.png"
      width={1080}
      height={1457}
      alt="Sail Lore"
      data-logo-variant={variant}
      className={`w-auto object-contain ${className}`}
      style={{ filter: variant === "monochrome" ? "grayscale(1) contrast(1.8)" : undefined }}
    />
  );
}
