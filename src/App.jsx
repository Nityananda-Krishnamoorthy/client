// src/App.js
import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom'
import RootLayout from './RootLayout'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import BookmarksPage from './pages/BookmarksPage'
import Profile from './pages/Profile'
import SinglePost from './pages/SinglePost'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { Provider, useSelector } from 'react-redux'
import store from './store/store'
import CreatePostPage from './pages/CreatePostPage'
import RecentDeleted from './pages/RecentDelete'
import EditPost from './pages/EditPost'
import NotificationPage from './pages/NotificationPage'
import SettingsPage from './pages/SettingsPage'
import ExplorePage from './pages/ExplorePage'
import BlockedUsersPage from './pages/BlockedUserPage'
import UserPosts from './components/UserPosts'
import Messages from './pages/Messages'  // Updated Messages component
import Conversation from './components/chat/Conversation'  // New chat components
import ConversationList from './components/chat/ConversationList'


// Protected route wrapper
const ProtectedRoute = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const location = useLocation();
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

// Public route wrapper (for already authenticated users)
const PublicRoute = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/', 
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      { 
        element: <RootLayout />,
        children: [
          { index: true, element: <Home /> },
          
          // Updated messages routes
          { 
            path: 'messages', 
            element: <Messages />,
            children: [
              { index: true, element: <ConversationList /> },
              { path: ':conversationId', element: <Conversation /> }
            ]
          },
          
          { path: 'bookmarks', element: <BookmarksPage /> },
          { path: 'users/:id', element: <Profile /> },
          { path: 'post/:id', element: <SinglePost /> },
          { path: 'create-post', element: <CreatePostPage/> },
          { path: 'deleted', element: <RecentDeleted/> },
          { path: 'edit-post/:id', element: <EditPost/> },
          { path: 'notifications', element : <NotificationPage/> },
          { path: 'settings', element : <SettingsPage/> },
          { path: 'explore', element : <ExplorePage/> },
          { path: 'blocked-users', element : <BlockedUsersPage/> },
          { path: "/users/:id/posts", element: <UserPosts /> }
        ]
      },
    ]
  },
  { 
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> }
    ]
  },
  { path: "/logout", element: <Logout /> }
])

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App