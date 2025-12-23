import { useContext, useEffect } from "react";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import Post from "../components/Post"
import SkeletonFeed from "../components/SkeletonFeed"
export default function Feed() {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  const {
    posts,
    fetchPosts,
    loading,
    hasMore,
  } = useInfinitePosts(serverUrl);
  



  const sentinelRef = useInfiniteScroll(fetchPosts, hasMore, loading);

  // initial fetch ONCE after auth
  useEffect(() => {
    if (userData !== "loading" && Object.keys(userData).length) {
      fetchPosts();
    }
  }, [userData]); // ❗ intentionally NOT adding fetchPosts


  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Post
          key={post._id}
          post={post}
        />
      ))}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-[1px]"
        />
      )}

      {loading && <SkeletonFeed />}
    </div>
  );
}
