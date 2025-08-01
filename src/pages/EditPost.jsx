import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
// import { IoMdImages } from 'react-icons/io';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user?.currentUser?.token);

  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const post = res.data;
        setBody(post.body);
        setTags(post.tags?.join(', ') || '');
        setLocation(post.location || '');

        const formattedMedia = (post.media || []).map((item) => {
          const url = typeof item === 'string' ? item : item?.url;
          const type = typeof item === 'string' ? url?.split('.').pop() : item?.type || url?.split('.').pop();
          if (!url || typeof url !== 'string') return null;
          return { preview: url, type };
        }).filter(Boolean);

        setPreviewMedia(formattedMedia);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
    }));
    setMedia(files);
    setPreviewMedia((prev) => [...prev, ...newPreviews]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('body', body);
    formData.set('tags', tags);
    formData.set('location', location);
    media.forEach((file) => formData.append('media', file));

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Post updated successfully');
      navigate('/');
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('Error updating post');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 py-12 md:p-6 lg:p-8">
      <button className="text-red-500 text-sm mb-4" onClick={() => navigate(-1)}>
        × Cancel
      </button>

      <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What's on your mind?"
        />

        <input
          type="text"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {previewMedia.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewMedia.map((item, index) => {
              const src = item.preview;
              const type = item.type || '';
              const isImage = type.startsWith('image') || /\.(jpeg|jpg|png|gif)$/i.test(src);
              const isVideo = type.startsWith('video') || /\.(mp4|webm)$/i.test(src);
              const isAudio = type.startsWith('audio') || /\.(mp3)$/i.test(src);

              if (isImage) {
                return <img key={index} src={src} alt={`media-${index}`} className="w-full h-24 object-cover rounded-md" />;
              }
              if (isVideo) {
                return <video key={index} src={src} controls className="w-full rounded-md" />;
              }
              if (isAudio) {
                return <audio key={index} controls className="w-full"><source src={src} /></audio>;
              }
              return null;
            })}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* <label htmlFor="media" className="cursor-pointer text-blue-600 hover:text-blue-800">
            <IoMdImages size={28} />
          </label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*,audio/*"
            multiple
            hidden
            onChange={handleMediaChange}
          />*/}
          <button
            type="submit"
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          > 
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;