import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export const tokenVerifier = {
  verifyAccessToken: (token) => {
    try {
        
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },

  verifyRefreshToken: (token) => {
    try {

      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },
};
