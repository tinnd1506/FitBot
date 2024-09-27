// Import the JSON Web Token (JWT) library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWTs
const authenticateToken = (req, res, next) => {
    console.log('Authenticating token...');  // Log authentication attempt

    // Get the Authorization header and extract the token if it exists
    const authHeader = req.headers['authorization'];
    
    // Token is typically in the format "Bearer <token>", so split and take the second part (the actual token)
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token is provided, return a 401 Unauthorized status
    if (!token) return res.sendStatus(401);  // No token means the client is not authenticated

    // Verify the token using the secret key from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // If token verification fails (e.g., invalid or expired token), return a 403 Forbidden status
      if (err) return res.sendStatus(403);  // The token is invalid, deny access

      // If verification is successful, attach the decoded user information to the request object
      req.user = user;

      // Call the next middleware or route handler in the stack
      next();
    });
};

// Export the middleware function so it can be used to protect routes
module.exports = authenticateToken;
