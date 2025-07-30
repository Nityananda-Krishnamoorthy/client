import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IoMdImages } from 'react-icons/io';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user?.currentUser?.token);

  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);

  // Fetch existing post data
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
        // if item is a string, treat it as a URL only
        const url = typeof item === 'string' ? item : item?.url;
        const type = typeof item === 'string'
          ? url?.split('.').pop()
          : item?.type || url?.split('.').pop();

        if (!url || typeof url !== 'string') return null;

        return { preview: url, type };
      }).filter(Boolean); // remove nulls

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
<>
    <button className="cancel-button " onClick={() => navigate(-1)}>
            x cancel
        </button>
    <div className="editPostPage">
        
      <h2>Edit Post</h2>
      

      <form onSubmit={handleUpdate}>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {previewMedia.length > 0 && (
          <div className="editPost__preview">
            {previewMedia.length > 0 && (
                <div className="editPost__preview">
                    {previewMedia.map((item, index) => {
                        const src = item.preview;
                        const type = item.type || '';

                        // Helper functions for fallback in case `type` is missing
                        const isImage = type.startsWith('image') || /\.(jpeg|jpg|png|gif)$/i.test(src);
                        const isVideo = type.startsWith('video') || /\.(mp4|webm)$/i.test(src);
                        const isAudio = type.startsWith('audio') || /\.(mp3)$/i.test(src);

                        if (isImage) {
                        return (
                            <img
                            key={index}
                            src={src}
                            alt={`media-${index}`}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                            />
                        );
                        }

                        if (isVideo) {
                        return (
                            <video
                            key={index}
                            src={src}
                            controls
                            style={{ width: '150px', borderRadius: '8px' }}
                            />
                        );
                        }

                        if (isAudio) {
                        return (
                            <audio key={index} controls style={{ marginTop: '8px' }}>
                            <source src={src} />
                            </audio>
                        );
                        }

                        return null;
                    })}
                    </div>
                )}
          </div>
        )}

         <div className="editPost__bottom">
         <label htmlFor="media">
            <IoMdImages size={28} />
        </label>
            <input
                type="file"
                id="media"
                accept="image/*,video/*,audio/*"
                multiple
                hidden
                onChange={handleMediaChange}
                />
            <button type="submit" >
                Update Post
            </button>
            </div>
      </form>
    </div>

    </>
  );
};

export default EditPost;
