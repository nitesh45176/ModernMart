import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    console.log("🧪 Incoming Token:", token); // ✅ DEBUG LOG

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    // ✅ Optional: Validate token format
    if (typeof token !== "string" || token.split(".").length !== 3) {
      return res.status(401).json({ message: "Unauthorized - Malformed token format" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("✅ Decoded Token:", decoded); // DEBUG

      const user = await User.findById(decoded.userId || decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
      }

      user.role = user.role.trim();
      req.user = user;

      next();

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Unauthorized - Access token expired" });
      }
      throw err;
    }

  } catch (error) {
    console.log("❌ Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};



export const adminRoute = (req,res,next)=> {
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        return res.status(401).json({message: "Access denied - Admin only"});
    }
}