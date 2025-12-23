function SkeletonFeed() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-40 bg-gray-200 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}

export default SkeletonFeed;
