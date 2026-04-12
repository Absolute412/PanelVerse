export function Logo({ size = 28, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size }}
    >
      📦
    </span>
  );
}