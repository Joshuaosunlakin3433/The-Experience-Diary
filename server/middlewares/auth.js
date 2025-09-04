import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // Check if header exists
    if (!authHeader) {
      return res.json({ success: false, message: "No token provided" });
    }
    
    // Extract token from "Bearer TOKEN_HERE"
    const token = authHeader.split(' ')[1]; // Split and take the second part
    
    // Check if token exists after splitting
    if (!token) {
      return res.json({ success: false, message: "Invalid token format" });
    }
    
    // Verify the token and get the decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object for use in route handlers
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Token expired" });
    } else if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: "Invalid token" });
    } else {
      return res.json({ success: false, message: "Token verification failed" });
    }
  }
};

export default auth;