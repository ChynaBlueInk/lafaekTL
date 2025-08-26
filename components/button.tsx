import * as React from "react";

type Variant = "primary" | "secondary" | "brandOutline";

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
    "inline-flex items-center justify-center font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles: Record<Variant, string> = {
    // Your original green button
    primary: "bg-green-700 hover:bg-green-800 text-white focus:ring-green-400",

    // Neutral secondary (kept generic in case you use it elsewhere)
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-blue-400",

    // Brand outline: white bg + dark green text; hover flips to dark green bg + white text
    brandOutline:
      "bg-white text-[#219653] border border-[#219653] hover:bg-[#219653] hover:text-white focus:ring-[#6FCF97]",
  };

  return (
    <button
      {...props}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
