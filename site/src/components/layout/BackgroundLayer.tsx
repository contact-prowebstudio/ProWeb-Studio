export default function BackgroundLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50"
      style={{
        backgroundColor: "var(--app-bg-color)",
        backgroundImage: "var(--app-bg-gradient)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    />
  );
}
