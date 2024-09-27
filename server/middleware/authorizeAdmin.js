// Middleware function to authorize admin users
const authorizeAdmin = (req, res, next) => {
    console.log('Authorizing admin...');  // Log the authorization attempt

    // Check if the user's role is not 'admin'
    // The user object should have been attached to req in a previous middleware (e.g., authentication)
    if (req.user.role !== 'admin') {
      // If the user is not an admin, return a 403 Forbidden status with an access denied message
      return res.status(403).json({ message: 'Access denied' });
    }

    // If the user is an admin, allow the request to proceed to the next middleware or route handler
    next();
};

// Export the middleware function to be used in routes that require admin privileges
module.exports = authorizeAdmin;
