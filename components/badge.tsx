type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full bg-green-700 px-3 py-1 text-sm font-semibold text-white ${className}`}>
      {children}
    </span>
  );
}
