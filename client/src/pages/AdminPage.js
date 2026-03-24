import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/hooks/useAuth';
import { getUsers, updateUser, deleteUser } from '../api';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/animations/AnimationComponents';

// Floating particles animation
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-[var(--terracotta)] rounded-full opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, -100],
          x: [0, Math.random() * 40 - 20],
          opacity: [0.2, 0],
          scale: [1, 0.5],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
); 

const AdminPage = () => {
  // State and hooks
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  // Effect to check user role and fetch users
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/user');
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
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F1E8 50%, #FAF9F6 100%)'
      }}>
        {/* Animated background gradients */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(224, 122, 95, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(224, 122, 95, 0.1) 0%, transparent 50%)',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        
        {/* Floating particles */}
        <FloatingParticles />
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Header */}
          <motion.div 
            className="mb-10 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[var(--terracotta)] to-transparent rounded-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] flex items-center justify-center shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-2xl relative z-10">👑</span>
              </motion.div>
              <span className="text-xs font-semibold text-[var(--warm-gray)] uppercase tracking-wider">ADMINISTRATION</span>
            </div>
            <div className="flex justify-between items-end">
              <motion.h1 
                className="text-5xl font-bold tracking-tight text-[var(--charcoal)]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Admin Dashboard
              </motion.h1>
              <motion.button
                onClick={handleLogout}
                className="px-6 py-3 bg-[var(--charcoal)] text-white font-semibold rounded-xl shadow-md relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10 font-bold text-sm">Logout</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats card */}
          <motion.div 
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 relative overflow-hidden"
              whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--terracotta)]/10 to-transparent rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-[var(--dark-gray)] uppercase tracking-wider mb-2">Total Users</p>
                <motion.p 
                  className="text-5xl font-bold text-[var(--charcoal)]"
                  key={users.length}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {users.length}
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] rounded-xl p-6 shadow-lg text-white relative overflow-hidden"
              whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(224, 122, 95, 0.4)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2">Admin Users</p>
                <p className="text-4xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 relative overflow-hidden"
              whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[var(--terracotta)]/10 to-transparent rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-[var(--dark-gray)] uppercase tracking-wider mb-2">Regular Users</p>
                <p className="text-4xl font-bold text-[var(--charcoal)]">{users.filter(u => u.role === 'user').length}</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* User list */}
          <StaggerContainer className="space-y-4">
            {users.map((user, index) => (
              <StaggerItem key={user._id}>
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 relative overflow-hidden group"
                  whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)' }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--terracotta)]/0 via-[var(--terracotta)]/5 to-[var(--terracotta)]/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <AnimatePresence mode="wait">
                    {editingUser && editingUser._id === user._id ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col md:flex-row items-center gap-4"
                      >
                        <input
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all font-medium"
                          placeholder="Username"
                        />
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all font-medium"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="flex gap-2">
                          <motion.button 
                            onClick={handleUpdate} 
                            className="px-6 py-2.5 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-bold rounded-xl shadow-md relative overflow-hidden"
                            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 25px -5px rgba(224, 122, 95, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10 text-sm">💾 Save</span>
                          </motion.button>
                          <motion.button 
                            onClick={() => setEditingUser(null)} 
                            className="px-6 py-2.5 bg-white border-2 border-gray-300 text-[var(--charcoal)] font-bold rounded-xl"
                            whileHover={{ scale: 1.02, y: -2, borderColor: 'var(--charcoal)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-sm">✖️ Cancel</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <motion.div 
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] flex items-center justify-center text-white font-semibold shadow-lg relative overflow-hidden"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10 text-lg">{user.username.charAt(0).toUpperCase()}</span>
                          </motion.div>
                          <div>
                            <p className="font-bold text-xl text-[var(--charcoal)]">{user.username}</p>
                            <motion.span 
                              className={`inline-block text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                                user.role === 'admin' 
                                  ? 'bg-gradient-to-r from-[var(--charcoal)] to-[var(--dark-gray)] text-white shadow-md' 
                                  : 'bg-gray-200 text-[var(--charcoal)]'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {user.role === 'admin' ? '👑 ' : '👤 '}{user.role}
                            </motion.span>
                          </div>
                        </div>
                        <div className="flex gap-2 relative z-10">
                          <motion.button 
                            onClick={() => handleEdit(user)} 
                            className="px-6 py-2.5 bg-white border-2 border-[var(--charcoal)] font-bold rounded-xl relative overflow-hidden group"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className="absolute inset-0"
                              style={{ background: 'linear-gradient(135deg, rgba(224, 122, 95, 0.18), rgba(224, 122, 95, 0.08))' }}
                              initial={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 text-sm text-[var(--charcoal)] transition-colors duration-300">✏️ Edit</span>
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDelete(user._id)} 
                            className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md relative overflow-hidden"
                            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10 text-sm">🗑️ Delete</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPage;
