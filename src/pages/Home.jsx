import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost';
import axios from 'axios';
import Feed from '../components/Feed';
import Stories from '../components/Stories';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const token = useSelector(state => state?.user?.currentUser?.token)

  // Create Post
  const createPost = async (data) => {
    setError("")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newPost = response?.data?.post;
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  // Get Posts
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response?.data?.posts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [token]);

 return (
  <section className="h-full w-full flex flex-col">
    <Stories />
    {/* Scrollable Area */}
    <div className="flex-1  px-4 py-16">
      {/* Create Post */}
      <div className="max-w-2xl mx-auto mb-6">
        <CreatePost onCreatePost={createPost} error={error} />
      </div>

      {/* Loading / Error / Empty / Feed */}
      {isLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg">
          Loading posts...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : posts?.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No posts available.
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {posts.map((post) => (
            <div key={post._id} className="rounded-xl transition">
              <Feed post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

};

export default Home;
