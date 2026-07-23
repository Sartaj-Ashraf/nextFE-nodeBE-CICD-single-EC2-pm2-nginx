export default function LoadingSpinner({
  height = 10,
  width = 10,
  bgColorName = "--primary",
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full h-${height} w-${width} border-t-2 border-b-2 border-[var(${bgColorName})] `}
      ></div>
    </div>
  );
}
