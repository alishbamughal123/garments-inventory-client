import { cn } from "../../utils/cn";

const SurfaceCard = ({
  as: Component = "section",
  className,
  children,
  ...props
}) => (
  <Component
    className={cn(
      "rounded-2xl border border-slate-200 bg-white shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

export default SurfaceCard;
