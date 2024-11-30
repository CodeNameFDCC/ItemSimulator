import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;

export function authenticateJWT(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "액세스 토큰이 필요합니다." }); // 토큰이 없으면 401 Unauthorized

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "유효하지 않은 액세스 토큰입니다." }); // 유효하지 않은 토큰이면 403 Forbidden
    req.user = user; // 요청 객체에 사용자 정보 추가
    next(); // 다음 미들웨어로 넘어감
  });
}

//#region Backup
/*
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization 헤더가 없습니다." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "토큰이 없거나 형식이 잘못되었습니다." });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    }
    req.user = user;

    next();
  });
};
*/
//#endregion
