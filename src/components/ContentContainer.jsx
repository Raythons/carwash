export function ContentContainer({ children, className = "" }) {
  return (
    <div
      className={`relative z-0 w-full max-w-full min-h-screen overflow-x-auto overflow-y-hidden dark:text-gray-100 ${className}`}
      dir="rtl"
    >
      <div className="relative z-10 w-full max-w-full">{children}</div>
    </div>
  );
}
