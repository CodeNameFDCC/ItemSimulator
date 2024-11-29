import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//#region 캐릭터 생성
// 캐릭터 생성
router.post("/character", authenticateJWT, async (req, res) => {
  const isLogin = req.session.userId;

  if (!isLogin) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }

  const { nickName } = req.body; // 요청 본체에서 nickName 얻기

  if (!nickName) {
    return res.status(400).json({ mesaage: "닉네임을 입력해주세요." });
  }

  try {
    const preCharacter = await prisma.character.findFirst({
      where: {
        nickName,
      },
    });

    if (preCharacter) {
      return res.status(409).json("이미 사용중인 닉네임 입니다.");
    }

    const newCharacter = await prisma.character.create({
      data: {
        nickName,
        userId: req.session.userId,
      },
    });

    const newInventory = await prisma.inventory.create({
      data: {
        character: {
          connect: { id: newCharacter.id }, // characterId 대신 character 연결
        },
      },
    });

    const newEquipment = await prisma.equipment.create({
      data: {
        character: {
          connect: { id: newCharacter.id }, // characterId 대신 character 연결
        },
      },
    });

    return res.status(201).json(newCharacter);
  } catch (error) {
    console.error("캐릭터 생성 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 캐릭터 선택

// 캐릭터 선택
router.post("/character/select/:id", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.params.id; // URL에서 캐릭터 ID 가져오기
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  console.log(characterId);

  if (!characterId) {
    return res.status(401).json({ mesaage: "잘못된 접근입니다." });
  }

  const selectCharacter = await prisma.character.findFirst({
    where: { id: characterId },
  });

  if (!selectCharacter) {
    return res.status(401).json({ mesaage: "잘못된 접근입니다." });
  }

  req.session.selectCharacter = characterId;
  return res
    .status(200)
    .json({ mesaage: "성공적으로 캐릭터 선택이 완료되었습니다." });
});

//#endregion

//#region 선택 캐릭터 조회
router.get("/character/select", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ mesaage: "캐릭터 선택을 먼저 해주세요" });
  }

  const selectCharacter = await prisma.character.findFirst({
    where: { id: characterId },
  });

  if (!selectCharacter) {
    return res.status(401).json({ mesaage: "잘못된 접근입니다." });
  }

  return res.status(200).json({ data: { selectCharacter: selectCharacter } });
});
//#endregion

//#region 내 캐릭터 조회
//나의 캐릭터 조회
router.get("/character", authenticateJWT, async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(500).json({ message: "로그인 부터 해주세요" });
    }

    const characters = await prisma.character.findMany({
      where: { userId: userId },
    });

    if (!characters) {
      res.status(200).json("캐릭터가 없습니다!");
    }

    res.status(200).json(characters);
  } catch (error) {
    console.error("캐릭터 목록 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
//#endregion

//#region 모든 캐릭터 조회
// 모든 캐릭터 목록 조회 (Read)
router.get("/characters", async (req, res) => {
  try {
    const characters = await prisma.character.findMany();
    res.status(200).json(characters);
  } catch (error) {
    console.error("캐릭터 목록 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
//#endregion

//#region 캐릭터 수정
// 캐릭터 수정 (Update)
router.put("/character", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ mesaage: "캐릭터 선택을 먼저 해주세요" });
  }

  const { atkDmg, dfense, health, gold } = req.body; // 요청 본체에서 데이터 얻기
  try {
    // 캐릭터가 존재하는지 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId },
    });

    // 캐릭터가 존재하지 않으면 에러 반환
    if (!existingCharacter) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    // 캐릭터 업데이트
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        atkDmg,
        dfense,
        health,
        gold,
      },
    });

    res.status(200).json(updatedCharacter);
  } catch (error) {
    console.error("캐릭터 수정 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 캐릭터 삭제
// 캐릭터 삭제 (Delete)
router.delete("/character", async (req, res) => {
  const isLogin = req.session.userId;

  if (!isLogin) {
    return res.status(400).json({ message: "로그인 먼저 하세요" });
  }
  const selectCharacter = req.session.selectCharacter;

  if (!selectCharacter) {
    return res.status(400).json({ message: "캐릭터가 선택되지 않았습니다." });
  }

  try {
    // 캐릭터가 존재하는지 확인
    const existingCharacter = await prisma.character.findFirst({
      where: { id: selectCharacter },
    });

    // 캐릭터가 존재하지 않으면 에러 반환
    if (!existingCharacter) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    // // 캐릭터가 사용자의 것인지 확인
    // if (existingCharacter.userId !== userId) {
    //   return res
    //     .status(403)
    //     .json({ message: "이 캐릭터를 삭제할 권한이 없습니다." });
    // }

    // 캐릭터 삭제
    await prisma.character.delete({
      where: { id: selectCharacter },
    });

    req.session.selectCharacter = null;
    // 삭제 성공 메시지를 포함한 200 OK 응답
    return res
      .status(200)
      .json({ message: "캐릭터가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("캐릭터 삭제 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

export default router;
