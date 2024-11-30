import express from "express";
import bcrypt from "bcryptjs";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import jwt from "jsonwebtoken"; // jwt 모듈 import
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

//#region 로그인

const router = express.Router();
// 로그인 요청 처리
router.post("/login", async (req, res) => {
  try {
    const { userName, userPassword } = req.body;
    // 사용자 이름으로 계정 조회 (비동기 처리)
    const account = await prisma.account.findFirst({ where: { userName } });

    // 계정이 없거나 비밀번호가 유효하지 않은 경우
    if (!account) {
      return res
        .status(401)
        .json({ message: "로그인 실패: 잘못된 사용자 이름 또는 비밀번호" });
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      account.userPassword
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "로그인 실패: 잘못된 사용자 이름 또는 비밀번호" });
    }

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userName: account.userName, id: account.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userName: account.userName },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      userId: account.id,
      userName: account.userName,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    //throw new Error("로그인 에러 : " + error);
    res.status(500).json({ error: "User login failed" });
  }
});

//#endregion

//#region 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { userEmail, userName, userPassword } = req.body;
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const account = await prisma.account.create({
      data: {
        userName,
        userEmail,
        userPassword: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created", account });
  } catch (error) {
    res.status(500).json({ error: "User creation failed" });
    //throw new Error("회원가입 Error" + error);
  }
});
//#endregion

//#region Backup
/*
//#region 회원가입

//===========================================
//===========================================

// 회원가입
router.post("/register", async (req, res) => {
  const isLogin = req.session.userId;
  if (isLogin) {
    return res.status(400).json({
      success: false,
      message: "로그아웃을 한 이후에 회원가입을 시도해 주세요.",
    });
  }
  try {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, loginId, password } = req.body;
    // 이메일 형식 체크
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "유효한 이메일 형식이 아닙니다." });
    }

    // 사용자 중복 체크
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email }, // 이메일 중복 확인
          { loginId: loginId }, // 닉네임 중복 확인
        ],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "사용자가 이미 존재합니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        loginId,
        password: hashedPassword,
      },
    });

    const userInfo = await prisma.userInfo.create({
      data: {
        userId: newUser.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    await prisma.$disconnect(); // Prisma 클라이언트 연결 종료
  }
});

//===========================================
//===========================================

//#endregion

//#region 로그인

//===========================================
//===========================================
let refreshTokens = [];

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
// 로그인
router.post("/login", async (req, res) => {
  const loginId = req.session.userId;
  if (loginId) {
    return res
      .status(400)
      .json({ success: false, message: "로그아웃을 먼저 해주세요!" });
  }
  try {
    const { loginId, password } = req.body;

    const user = await prisma.user.findUnique({ where: { loginId } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "비밀번호가 올바르지 않습니다." });
    }
    const accessToken = jwt.sign(
      { id: user.id, loginId: user.loginId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, loginId: user.loginId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    refreshTokens.push(refreshToken); // 리프레시 토큰 저장

    res.setHeader("authorization", `Bearer ${accessToken}`);

    req.session.userId = user.id; // 세션에 사용자 ID 저장

    console.log("----------로그인유저--------------");
    console.log(req.session.userId);
    console.log("---------------------------------");

    res.json({
      success: true,
      mesassge: "로그인 성공 하였습니다.",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    await prisma.$disconnect();
  }
});

//===========================================
//===========================================

//#endregion

//#region 토큰요청

// 액세스 토큰 요청 라우트
router.post("/token", (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.sendStatus(403); // 유효하지 않은 리프레시 토큰
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  });
});

//#endregion

//#region 회원탈퇴

//===========================================
//===========================================

router.delete("/withdraw", authenticateJWT, async (req, res) => {
  const loginId = req.session.userId;
  if (!loginId) {
    return res.status(400).json({ message: "잘못된 접근입니다." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: loginId } });
    if (!user) {
      res.status(200).json({ maessage: "잘못된 접근입니다." });
    } else {
      delete req.headers["authorization"];
      req.session.destroy();
      await prisma.user.delete({ where: { id: req.user.id } });
      res.status(200).json({ maessage: "성공적으로 제거" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ maessage: "서버에서 오류가 발생했습니다." });
  }
});

//===========================================
//===========================================

//#endregion

//#region 로그아웃

//===========================================
//===========================================

// 로그아웃
router.post("/logout", authenticateJWT, (req, res) => {
  const isLogin = req.session.userId;
  if (!isLogin) {
    return res.status(401).json({ message: "잘못된 접근입니다." });
  }
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token); // 리프레시 토큰 삭제

  delete req.headers["authorization"];

  req.session.destroy();

  const isLogout = req.session;
  if (isLogout) {
    return res
      .status(500)
      .json({ message: "로그아웃 중 오류가 발생했습니다." });
  } else {
    return res.status(200).json({ message: "로그아웃 성공적으로 되었습니다." });
  }
});

//===========================================
//===========================================

//#endregion

//#region 유저목록

//===========================================
//===========================================

// 유저 목록 조회 API
router.get("/users", authenticateJWT, async (req, res) => {
  const loginId = req.session.userId;
  if (!loginId) {
    return res.status(200).json({ message: "로그인 먼저 해주세요." });
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        loginId: true,
        //createdAt: true,
        //updatedAt: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("유저 목록 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  } finally {
    await prisma.$disconnect();
  }
});

//===========================================
//===========================================

//#endregion

*/
//#endregion

export default router;
