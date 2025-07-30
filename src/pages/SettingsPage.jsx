import React, { useState } from 'react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    theme: 'light',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Updated Settings:', formData);
    // TODO: Add API call
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Account Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setFormData({ fullName: '', email: '', bio: '', theme: 'light' })}
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
