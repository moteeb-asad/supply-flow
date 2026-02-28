export default function ProgressBar() {
  return (
    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 z-50">
      <div className="h-full bg-primary animate-progress"></div>
    </div>
  );
}
