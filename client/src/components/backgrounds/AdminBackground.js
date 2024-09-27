import React from 'react';

// AdminBackground component: Creates a decorative background with animated blobs
const AdminBackground = () => {
  return (
    // Container for the entire background
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {/* Purple blob */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      
      {/* Blue blob with delayed animation */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      {/* Pink blob with further delayed animation */}
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default AdminBackground;
