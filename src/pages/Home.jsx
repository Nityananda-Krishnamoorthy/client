import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost';
import axios from 'axios';
import Feed from '../components/Feed';




const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const token = useSelector(state => state?.user?.currentUser?.token)
  

  // FUNCTION TO CREATE POST
  const createPost = async (data) => {
    setError("")
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data,
        {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
        const newPost = response?.data?.post;
        setPosts([newPost,...posts])
    } catch (err){
      setError(err?.response?.data?.message)
    }

  }


  //FUNCTIONS TO GET POSTS
  const getPosts = async () =>{
    setIsLoading(true)
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {withCredentials:true, headers:{Authorization: `Bearer ${token}`}});
      setPosts(response?.data?.posts)

    }catch(err){
      console.log(err)
    }
    finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    getPosts();

  },[setPosts]);

  if (isLoading) {
    return <div className="center">Loading post...</div>;
  }

  if (error) {
    return <div className="center">{error}</div>;
  }

  if (!posts) {
    return <div className="center">Post not found</div>;
  }

  return (
    <section className=" w-full min-h-screen  ">
      {/* Create Post Section */}
      <div className="max-w-2xl mx-auto mb-6">
        <CreatePost onCreatePost={createPost} error={error} />
      </div>

      {/* Loader or Error */}
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
        // Feed Section
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {posts.map((post) => (
            <div
              key={post._id}
              className=" rounded-xl  transition "
            >
              <Feed post={post} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Home


