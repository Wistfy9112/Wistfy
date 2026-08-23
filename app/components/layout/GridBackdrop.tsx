export default function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="bg-grid absolute inset-0" />
      <div
        className="absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% -20%, var(--glow), transparent 70%)",
        }}
      />
      <div className="noise absolute inset-0 opacity-[0.032]" />
    </div>
  );
}
