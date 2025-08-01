
// import React, { useEffect } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Widgets from './components/Widgets';
// import ThemeModal from './components/ThemeModal';

// const RootLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = useSelector(state => state.user.currentUser?.token);
//   const { themeModalIsOpen } = useSelector(state => state?.ui);
//   const { primaryColor, backgroundColor } = useSelector(state => state?.ui?.theme);
  
//   const isMessagesPage = location.pathname.startsWith('/messages');

//   useEffect(() => {
//     // Apply theme classes to body
//     const body = document.body;
    
//     // First remove all existing theme classes
//     const gradientClasses = [
//       'gradient-blue', 'gradient-purple', 'gradient-orange',
//       'gradient-green', 'gradient-pink'
//     ];
    
//     body.classList.remove(
//       'light', 'dark', 'black', 'ocean', 'forest', 
//       ...gradientClasses,
//       'red', 'blue', 'yellow', 'green', 'purple', 
//       'orange', 'pink', 'teal'
//     );
    
//     // Add new theme classes
//     if (primaryColor) body.classList.add(primaryColor);
//     if (backgroundColor) body.classList.add(backgroundColor);
    
//     // Redirect if not authenticated
//     if (!token) {
//       navigate('/login');
//     }
//   }, [token, navigate, primaryColor, backgroundColor]);

//   return (
//     <>
//       <Navbar />
//       <main className="main h-screen overflow-hidden"> 
//   <div className={`container main__container desktop-layout ${isMessagesPage ? 'messages-layout' : ''}`}>
//     {!isMessagesPage && <Sidebar />}

//     {/* Scrollable Outlet */}
//     <div
//       className={`outlet-container  scrollable-page flex-1 min-h-0 ${isMessagesPage ? 'full-width' : 'scrollable-page'} flex-1 min-h-0`}
//     >
//       <Outlet />
//     </div>

//     {!isMessagesPage && (
//       <div className="hidden lg:block flex-[2]">
//         <Widgets />
//       </div>
//     )}

//     {themeModalIsOpen && <ThemeModal />}
//   </div>
// </main>
//     </>
//   );
// };

// export default RootLayout;


import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';
import ThemeModal from './components/ThemeModal';

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(state => state.user.currentUser?.token);
  const { themeModalIsOpen } = useSelector(state => state?.ui);
  const { primaryColor, backgroundColor } = useSelector(state => state?.ui?.theme);
  
  const isMessagesPage = location.pathname.startsWith('/messages');

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

  return (
    <>
      <Navbar />
 <main className="h-screen overflow-hidden">
  {/* Use different layout containers */}
  {isMessagesPage ? (
    <div className="messages-layout-container h-full flex flex-col">
      <Outlet />
    </div>
  ) : (
    <div className="container main__container h-full flex">
      <Sidebar />
      <div className="outlet-container scrollable-page flex-1 min-h-0">
        <Outlet />
      </div>
      <div className="hidden lg:block flex-[2]">
        <Widgets />
      </div>
    </div>
  )}
  {themeModalIsOpen && <ThemeModal />}
</main>

    </>
  );
};

export default RootLayout;