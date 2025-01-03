import { tokenVerifier } from "../helpers/tokenVerifier.js";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  const verificationResult = tokenVerifier.verifyAccessToken(token);

  if (!verificationResult.valid) {
    return res
      .status(403)
      .json({ message: "Forbidden", error: verificationResult.error });
  }

  req.user = verificationResult.decoded;

  next();
};
