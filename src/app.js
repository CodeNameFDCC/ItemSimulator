//#region 모듈
import { prisma } from "./utils/prisma/index.js";
import express from "express";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import charaterRoutes from "./routes/characterRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import equipRoutes from "./routes/equipmentRoutes.js";
import errorHandler from "./middlewares/error.handler.middleware.js";
import errorLogger from "./middlewares/error.logger.middleware.js";
import logMiddleware from "./middlewares/log.middleware.js";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

//#endregion

dotenv.config();
const app = express();
const PORT = process.env.DATABASE_PORT;
app.use(express.static(path.join(process.cwd(), "public")));
async function main() {
  //#region 세션
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY, // 세션 서명에 사용되는 비밀 키
      resave: false, // 세션이 수정되지 않았더라도 저장할지 여부
      saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
      cookie: {
        maxAge: 1000 * 60 * 60, //1시간
        secure: false,
      }, // HTTPS에서만 쿠키를 전송하려면 true로 설정
    })
  );
  //#endregion
  //#region cors
  const corsOptions = {
    origin: "*", // 모든 출처 허용
    methods: ["GET", "POST"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  //#endregion

  app.use(express.json());
  app.use("/api", userRoutes);
  app.use("/api", charaterRoutes);
  app.use("/api", inventoryRoutes);
  app.use("/api", shopRoutes);
  app.use("/api", equipRoutes);

  app.get("/error", (req, res) => {
    throw new Error("강제 오류 발생!");
  });
  // app.use(logMiddleware);
  app.use(errorLogger);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
