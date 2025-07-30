import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Feed = ({ post }) => {
  const [creator, setCreator] = useState({});
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const creatorId = post?.creator?._id || post?.creator;

  const getPostCreator = async () => {
    if (!creatorId || post?.creator?.userName) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${creatorId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreator(response?.data);
    } catch (err) {
      console.error('Error fetching creator:', err);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, [creatorId, token]);

  return (
    <article className="feed rounded-xl overflow-hidden h-64">
      <Link to={`/post/${post._id}`} className="block h-full">
        <div className="h-full overflow-hidden">
          {/* Post Media */}
          {post?.media?.length > 0 && (
            <div className="h-64 w-full overflow-hidden relative">
              {post?.media.map((media, index) => (
                <div key={index} className="w-full h-full">
                  {media.type === 'image' || media.type === 'gif' ? (
                    <img
                      src={media.url}
                      alt={`Post media ${index}`}
                      className="w-full h-64 object-cover rounded-none"
                    />
                  ) : media.type === 'video' ? (
                    <video
                      controls
                      src={media.url}
                      className="w-full h-64 object-cover rounded-none"
                    />
                  ) : media.type === 'audio' ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      <audio controls className="w-11/12">
                        <source src={media.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* Post Text Content (if any) */}
          <div className="p-4 h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {post?.caption && (
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {post.caption}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Feed;
