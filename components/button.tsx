type Variant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: Variant;
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  const styles: Record<Variant, string> = {
    primary: "bg-green-700 hover:bg-green-800 text-white focus:ring-green-400",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-blue-400",
  };

  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
