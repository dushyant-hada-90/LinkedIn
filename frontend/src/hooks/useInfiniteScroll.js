
import { useEffect, useRef } from "react";

export function useInfiniteScroll(fetchPosts, hasMore, loading) {
  const sentinelRef = useRef();

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        console.log("intersected -> ",entry.isIntersecting)
        if (entry.isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchPosts, hasMore, loading]); // track loading + hasMore to prevent multiple calls

  return sentinelRef;
}
