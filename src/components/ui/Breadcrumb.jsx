import { cn } from "../../utilities/cn";

export function Breadcrumb({ className, ...props }) {
  return (
    <nav aria-label="breadcrumb" className={cn("flex", className)} {...props} />
  );
}

export function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({ className, ...props }) {
  return (
    <a
      className={cn(
        "transition-colors hover:text-foreground text-primary-600 hover:text-primary-800",
        className
      )}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </li>
  );
}
