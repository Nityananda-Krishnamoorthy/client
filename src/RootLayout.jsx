import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';
import ThemeModal from './components/ThemeModal';


const RootLayout = () => {
  const navigate = useNavigate();
  const token = useSelector(state => state.user.currentUser?.token);

const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      setIsTablet(width >= 600 && width < 1024);
    };

    handleResize();         // Initial check
    setIsClient(true);      // Render only after mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { themeModalIsOpen } = useSelector(state => state?.ui);
  const { primaryColor, backgroundColor } = useSelector(state => state?.ui?.theme);

useEffect(() => {
    // Apply theme classes to body
    const body = document.body;
    
    // First remove all existing theme classes
    const gradientClasses = [
      'gradient-blue', 'gradient-purple', 'gradient-orange',
      'gradient-green', 'gradient-pink'
    ];
    
    body.classList.remove(
      'light', 'dark', 'black', 'ocean', 'forest', 
      ...gradientClasses,
      'red', 'blue', 'yellow', 'green', 'purple', 
      'orange', 'pink', 'teal'
    );
        // Add new theme classes
    if (primaryColor) body.classList.add(primaryColor);
    if (backgroundColor) body.classList.add(backgroundColor);
    
    // Redirect if not authenticated
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate, primaryColor, backgroundColor]);


  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    const body = document.body;
    body.className = `${primaryColor} ${backgroundColor}`;
  }, [primaryColor, backgroundColor]);

  return (
    < >
      <Navbar />
      <main className='main min-h-screen overflow-y-auto'> 
        <div className="container main__container desktop-layout">
          <Sidebar isMobile={isMobile} isTablet={isTablet} />
          <Outlet />
           {isClient && !isMobile && !isTablet && (
            <div className="hidden lg:block flex-[2]">
              <Widgets />
            </div>
          )}
          {themeModalIsOpen && <ThemeModal />}
        </div>
      </main>
    </>
  );
};

export default RootLayout;