type TagProps = {
  children: string;
};

export default function Tag({ children }: TagProps) {
  return (
    <span className="border border-edge px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-dim">
      {children}
    </span>
  );
}
