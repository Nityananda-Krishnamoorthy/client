import React, { useEffect, useRef, useState } from 'react';
import ProfileImage from './ProfileImage';
import { useSelector } from 'react-redux';
import placeholderOptions from '../helpers/placeholders';
import { IoMdImages } from "react-icons/io";
import { FaHashtag, FaLocationArrow, FaUser } from 'react-icons/fa';

const MAX_MEDIA_FILES = 10;

const CreatePost = ({ onCreatePost, error, loading }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [mediaError, setMediaError] = useState('');

  const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);

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


  // Set random placeholder on mount
  useEffect(() => {
    const random = Math.floor(Math.random() * placeholderOptions.length);
    setPlaceholder(placeholderOptions[random]);
  }, []);

  // Clean up object URLs on unmount or media update
  useEffect(() => {
    return () => {
      previewMedia.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewMedia]);

  // Handle file input
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!body && media.length === 0) return;

    const postData = new FormData();
    postData.set("body", body);

    media.forEach(file => {
      postData.append("media", file);
    });

    const cleanedTags = tags.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .join(',');

    postData.set("tags", cleanedTags);
    postData.set("location", location);
    postData.set("scheduledAt", scheduledAt);

    onCreatePost(postData);

    // Reset form
    setBody('');
    setMedia([]);
    setPreviewMedia([]);
    setTags('');
    setLocation('');
    setScheduledAt('');
    setMediaError('');
  };

  // Remove individual media
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
      {/* Error messages */}
      {error && <p className="createPost__error-message">{error}</p>}
      {mediaError && <p className="createPost__error-message">{mediaError}</p>}

  

      {/* Media Preview */}
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

      {/* Scroll Arrows */}
      {previewMedia.length > 1 && (
        <div className="createPost__controls">
          <button type="button" onClick={() => scrollPreview('left')}>&larr;</button>
          <button type="button" onClick={() => scrollPreview('right')}>&rarr;</button>
        </div>
      )}
          {/* Textarea & profile image */}
      <div className="createPost__top">
        <ProfileImage image={profilePhoto} />
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      </div>

      {/* Extras: tags, location */}
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

      {/* Bottom: media upload & submit */}
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
