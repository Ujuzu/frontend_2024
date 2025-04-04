export default function Badge({
  className,
  count,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <i
      className={`w-4 text-[.58rem] h-4 flex justify-center items-center rounded-full absolute bg-red-500 top-0.5 right-0.5 text-white ${className}`}
    >
      {count}
    </i>
  );
}
