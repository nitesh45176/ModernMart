import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ===================
// Helper: Token Generation
// ===================
const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// ===================
// Helper: Store Refresh Token in Redis
// ===================
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

// ===================
// Helper: Set Cookies
// ===================
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ===================
// Signup Controller
// ===================
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = await generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ===================
// Login Controller
// ===================
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = await generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ===================
// Logout Controller
// ===================
export const logout = async (req, res) => {
  try {
    console.log("=== LOGOUT ATTEMPT ===");
    console.log("Cookies received:", req.cookies);

    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token:", refreshToken ? "Found" : "Not found");

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const redisKey = `refresh_token:${decoded.userId}`;

        const existsInRedis = await redis.get(redisKey);
        console.log("Token exists in Redis:", existsInRedis ? "Yes" : "No");

        const deleteResult = await redis.del(redisKey);
        console.log("Redis delete result:", deleteResult);
      } catch (jwtError) {
        console.log("JWT verification error:", jwtError.message);
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    console.log("✓ Logout completed successfully");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("❌ Error in logout controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===================
// Refresh Token Controller
// ===================
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refresh token controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===================
// Get Profile (Stub)
// ===================
export const getProfile = async (req, res) => {
  try{
      res.json(req.user);
  }
  catch(error){
     res.status(500).json({message:"Seerver error", error:error.message})
  }

};

// ===================
// Export All Controllers
// ===================
