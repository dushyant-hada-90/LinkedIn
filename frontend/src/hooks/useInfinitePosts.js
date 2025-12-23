import axios from "axios";
import { useCallback, useState } from "react";

export function useInfinitePosts(serverUrl) {
    const [posts, setPosts] = useState([])
    const [cursor, setCursor] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)



    const fetchPosts = useCallback(
        async () => {
            console.log(cursor, loading, hasMore)
            if (loading || !hasMore) return;
            setLoading(true)

            const res = await axios.get(`${serverUrl}/api/post/getpost`, {
                params: {
                    cursor: cursor ? JSON.stringify(cursor) : null, limit: 2,
                },

                withCredentials: true
            })
            console.log(res);


            setPosts(prev => {
                const map = new Map();
                [...prev, ...res.data.post].forEach(p => map.set(p._id, p));
                return Array.from(map.values());
            });

            setCursor(res.data.nextCursor);
            setHasMore(Boolean(res.data.nextCursor));
            setLoading(false);
        },
        [serverUrl, cursor, hasMore, loading],
    )
    return { posts, fetchPosts, loading, hasMore, };
}
