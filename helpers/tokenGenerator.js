import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

let refreshTokens = [];


export const tokenGenerator =  {
  generateAccessToken: (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  },
    generateRefreshToken: (id) => {
      const refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '1d' });
      refreshTokens.push(refreshToken);
      return refreshToken;
    }
};
