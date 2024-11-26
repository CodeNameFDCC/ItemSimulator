import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwtMiddleware from "../middlewares/auth.jwt.middleware.js";
import sessionMiddleware from "../middlewares/auth.session.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//#region  회원가입
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword, // 비밀번호는 해시 처리
        email,
      },
    });
    res.status(201).json({ message: "유저 등록 성공", user });
  } catch (error) {
    res.status(400).json({ message: "유저 등록 실패", error });
  }
});

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//#endregion

//#region 로그인
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    // 비밀번호 확인
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      req.session.userId = user.id;
      req.session.username = user.username;
      res.status(200).json({ message: "로그인 성공", token });
    } else {
      res.status(401).json({ message: "로그인 실패: 잘못된 비밀번호" });
    }
  } else {
    res.status(401).json({ message: "로그인 실패: 존재하지 않는 사용자" });
  }
});

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//#endregion

//#region 보호된 라우트

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
router.get("/protected", jwtMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: "이곳은 보호된 라우트입니다.", userId: req.userId });
});
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//#endregion

//#region 로그아웃

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
router.post("/logout", (req, res) => {
  // 세션 종료
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.status(200).json({ message: "로그아웃 성공" });
  });
});
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

router.get("/session", (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      message: "세션이 활성화되어 있습니다.",
      userId: req.session.userId,
    });
  } else {
    res.status(401).json({ message: "세션이 존재하지 않습니다." });
  }
});
//#endregion

export default router;
