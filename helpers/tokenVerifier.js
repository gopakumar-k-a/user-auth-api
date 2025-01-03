import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export const tokenVerifier = {
  verifyAccessToken: (token) => {
    try {
        console.log('verifyAccessToken token ',token);
        
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('decoded access token ',decoded);
      
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },

  verifyRefreshToken: (token) => {
    try {
      //   const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      //   console.log('decoded ',decoded);

      //   return { valid: true, decoded };
      console.log('Token is:', token);

      // Synchronously verify the token
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
      console.log('Decoded:', decoded);
  
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },
};
