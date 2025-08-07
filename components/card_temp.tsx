type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border p-4 shadow-lg bg-white text-black ${className}`}>
      {children}
    </div>
  );
}
