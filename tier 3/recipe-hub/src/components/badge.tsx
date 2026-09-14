interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "terracotta" | "olive";
  className?: string;
}

/** Small pill badge for time / difficulty / diet — replaces the v1 mono spec-tag. */
export default function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className ?? ""}`}>
      {children}
    </span>
  );
}
