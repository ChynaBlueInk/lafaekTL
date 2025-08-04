type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-xl transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
