import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiSliceAction } from '../store/ui-silce';

const ThemeModal = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state?.ui?.theme);
  const modalRef = useRef(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(uiSliceAction.closeThemeModal());
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dispatch(uiSliceAction.closeThemeModal());
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dispatch]);

  const changeBackgroundColor = (id) => {
    dispatch(uiSliceAction.changeTheme({...theme, backgroundColor: id}));
    localStorage.setItem("theme", JSON.stringify({...theme, backgroundColor: id}));  
  };
  
  const changePrimaryColor = (id) => {
    dispatch(uiSliceAction.changeTheme({...theme, primaryColor: id}));
    localStorage.setItem("theme", JSON.stringify({...theme, primaryColor: id}));  
  };

  // Solid background themes
  const solidThemes = [
    { id: 'light', name: 'Light', style: { background: 'linear-gradient(135deg, #f8f9fb, #e3e7ed)' } },
    { id: 'dark', name: 'Dark', style: { background: 'linear-gradient(135deg, #282c35, #16181b)' } },
  ];

  // Primary colors
  const primaryColors = [
    { id: 'red', name: 'Red', style: { backgroundColor: '#df2d56' } },
    { id: 'blue', name: 'Blue', style: { backgroundColor: '#3385ff' } },
    { id: 'yellow', name: 'Yellow', style: { backgroundColor: '#eca61c' } },
    { id: 'green', name: 'Green', style: { backgroundColor: '#04bb90' } },
    { id: 'purple', name: 'Purple', style: { backgroundColor: '#b21fc9' } },
    { id: 'orange', name: 'Orange', style: { backgroundColor: '#ff6b35' } },
    { id: 'pink', name: 'Pink', style: { backgroundColor: '#ff6b9d' } },
    { id: 'teal', name: 'Teal', style: { backgroundColor: '#00c9c8' } },
  ];

  return (
    <section className='theme' onClick={() => dispatch(uiSliceAction.closeThemeModal())}>
      <div 
        className="theme__container" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="theme__close-btn"
          onClick={() => dispatch(uiSliceAction.closeThemeModal())}
          title="Close"
        >
          &times;
        </button>

        <article className='theme__primary'>
          <h3>Primary Colors</h3>
          <ul>
            {primaryColors.map(({id, name, style}) => (
              <li 
                key={id}
                className={theme.primaryColor === id ? "active" : ""}
                style={style}
                onClick={() => changePrimaryColor(id)}
                title={name}
              />
            ))}
          </ul>
        </article>
        
        <article className='theme__primary'>
          <h3>Background Themes</h3>
          <ul>
            {solidThemes.map(({id, name, style}) => (
              <li 
                key={id}
                className={theme.backgroundColor === id ? "active" : ""}
                style={style}
                onClick={() => changeBackgroundColor(id)}
                title={name}
              />
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default ThemeModal;