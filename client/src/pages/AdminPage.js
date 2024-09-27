import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';
import { getUsers, updateUser, deleteUser } from '../api';
import AdminBackground from '../components/backgrounds/AdminBackground'; 

const AdminPage = () => {
  // State and hooks
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  // Effect to check user role and fetch users
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/chat');
    } else {
      fetchUsers();
    }
  }, [userRole, navigate]);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const userList = await getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handler for editing a user
  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  // Handler for updating a user
  const handleUpdate = async () => {
    try {
      await updateUser(editingUser._id, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handler for deleting a user
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error in handleDelete:', error);
        alert('Failed to delete user: ' + error.message);
      }
    }
  };

  // Handler for user logout
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8 relative overflow-hidden">
      <AdminBackground /> 
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Admin Dashboard header */}
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Admin Dashboard
        </h1>
        <h2 className="text-3xl font-bold mb-6 text-purple-400">User List</h2>
        
        {/* User list */}
        <ul className="space-y-6">
          {users.map(user => (
            <li key={user._id} className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
              {editingUser && editingUser._id === user._id ? (
                // Edit user form
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  {/* Username input */}
                  <input
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full md:w-auto px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  />
                  {/* Role select */}
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full md:w-auto px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {/* Save and Cancel buttons */}
                  <button onClick={handleUpdate} className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105">
                    Save
                  </button>
                  <button onClick={() => setEditingUser(null)} className="w-full md:w-auto px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300">
                    Cancel
                  </button>
                </div>
              ) : (
                // User display
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <span className="text-xl font-semibold mb-4 md:mb-0">
                    {user.username} - <span className="text-purple-400">{user.role}</span>
                  </span>
                  <div className="space-x-2">
                    {/* Edit and Delete buttons */}
                    <button onClick={() => handleEdit(user)} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-105">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="fixed bottom-8 right-8 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminPage;
