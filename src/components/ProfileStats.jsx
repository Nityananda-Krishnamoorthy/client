import React from 'react';
import { formatCount } from '../utils/helpers';

const ProfileStats = ({ following, followers, likes }) => {
  return (
    <ul className="flex justify-around py-4 border-y border-gray-200">
      <li className="text-center">
        <h4 className="text-lg font-bold">{formatCount(following)}</h4>
        <small className="text-gray-500">Following</small>
      </li>
      <li className="text-center">
        <h4 className="text-lg font-bold">{formatCount(followers)}</h4>
        <small className="text-gray-500">Followers</small>
      </li>
      <li className="text-center">
        <h4 className="text-lg font-bold">{formatCount(likes)}</h4>
        <small className="text-gray-500">Likes</small>
      </li>
    </ul>
  );
};

export default ProfileStats;