import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
  secondary:
    "border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-muted)]",
  danger:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50",
};

const sizes = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
  icon: "p-2 text-sm",
};

const Button = ({
  as: Component = "button",
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) => (
  <Component
    type={Component === "button" ? type : undefined}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  />
);

export default Button;
