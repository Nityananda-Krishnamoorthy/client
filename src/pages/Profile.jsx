import React from 'react';
import UserProfile from '../components/UserProfile';
import UserPosts from '../components/UserPosts';
//import { useSelector } from 'react-redux';
// import Feed from '../components/Feed';
import Feeds from '../components/Feeds';

const Profile = () => {
  //const user = useSelector(state => state?.data?.currentuser?._id)

  return (
    <main className="min-h-screen py-8">
      <UserProfile />
      
     
    </main>
    
  );
};

export default Profile;