type SectionHeaderProps = {
  index: string;
  label: string;
  title?: string;
  lede?: string;
};

export default function SectionHeader({
  index,
  label,
  title,
  lede,
}: SectionHeaderProps) {
  return (
    <div className="mb-14 md:mb-20">
      <div className="flex items-center gap-4">
        <span className="meta-label text-accent">{label}</span>
        <span className="meta-label text-faint">/ {index}</span>
        <span className="h-px flex-1 bg-hair" />
      </div>
      {title ? (
        <h2 className="mt-8 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
      ) : null}
      {lede ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim md:text-lg">
          {lede}
        </p>
      ) : null}
    </div>
  );
}
