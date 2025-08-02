import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProfileImage from './ProfileImage';
import { useSelector } from 'react-redux';
import placeholderOptions from '../helpers/placeholders';
import { IoMdImages } from "react-icons/io";
import { FaHashtag, FaLocationArrow } from 'react-icons/fa';

const MAX_MEDIA_FILES = 10;

const CreatePost = () => {
  const [placeholder, setPlaceholder] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state?.user?.currentUser);
  const profilePhoto = user?.profilePhoto;

  const previewRef = useRef(null);

  const scrollPreview = (direction) => {
    const scrollContainer = previewRef.current;
    if (!scrollContainer) return;

    const width = scrollContainer.offsetWidth;
    scrollContainer.scrollBy({
      left: direction === 'left' ? -width : width,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const random = Math.floor(Math.random() * placeholderOptions.length);
    setPlaceholder(placeholderOptions[random]);
  }, []);

  useEffect(() => {
    return () => {
      previewMedia.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewMedia]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = media.length + files.length;

    if (totalFiles > MAX_MEDIA_FILES) {
      setMediaError(`You can only upload up to ${MAX_MEDIA_FILES} files.`);
      return;
    }

    setMediaError('');

    const newMedia = [...media, ...files];
    const newPreviews = [...previewMedia, ...files.map(file => URL.createObjectURL(file))];

    setMedia(newMedia);
    setPreviewMedia(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body && media.length === 0) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.set("body", body);

    media.forEach(file => {
      formData.append("media", file);
    });

    const cleanedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .join(',');

    formData.set("tags", cleanedTags);
    formData.set("location", location);
    formData.set("scheduledAt", scheduledAt);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Post Created:', res.data);
      // Optional: callback or reload
      setBody('');
      setMedia([]);
      setPreviewMedia([]);
      setTags('');
      setLocation('');
      setScheduledAt('');
    } catch (err) {
      console.error('Post Error:', err);
      setError(err?.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedia = (index) => {
    const newMedia = [...media];
    const newPreviews = [...previewMedia];

    URL.revokeObjectURL(newPreviews[index]);

    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);

    setMedia(newMedia);
    setPreviewMedia(newPreviews);
  };

  return (
    <article className='Feed'>
      <form className="createPost" encType="multipart/form-data" onSubmit={handleSubmit}>
        {error && <p className="createPost__error-message">{error}</p>}
        {mediaError && <p className="createPost__error-message">{mediaError}</p>}

        {previewMedia.length > 0 && (
          <div className="createPost__preview-wrapper">
            <div className="createPost__preview" ref={previewRef}>
              {previewMedia.map((src, idx) => {
                const isVideo = media[idx]?.type?.startsWith('video');
                return (
                  <div key={idx} className="createPost__media-item">
                    {isVideo ? (
                      <video src={src} controls />
                    ) : (
                      <img src={src} alt={`preview-${idx}`} />
                    )}
                    <button type="button" onClick={() => handleRemoveMedia(idx)}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {previewMedia.length > 1 && (
          <div className="createPost__controls">
            <button type="button" onClick={() => scrollPreview('left')}>&larr;</button>
            <button type="button" onClick={() => scrollPreview('right')}>&rarr;</button>
          </div>
        )}

        <div className="createPost__top">
          <ProfileImage image={profilePhoto} />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
        </div>

        <div className="createPost__extras">
          <div className="createPost__tag">
            <FaHashtag size={14} />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
          <div className="createPost__tag">
            <FaLocationArrow size={12} />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="createPost__bottom">
          <label htmlFor="media">
            <IoMdImages size={25} />
          </label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleMediaChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </article>
  );
};

export default CreatePost;
