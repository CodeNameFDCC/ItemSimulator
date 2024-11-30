import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//#region 캐릭터 생성
router.post("/characters", async (req, res) => {
  const { name, image, userId } = req.body;

  // 입력 값 검증
  if (!name || !image || !userId) {
    return res
      .status(400)
      .json({ message: "이름, 이미지, 사용자 ID를 모두 입력해야 합니다." });
  }

  console.log(`이름: ${name}, 이미지: ${image}, 아이디: ${userId}`);

  try {
    // 사용자 존재 여부 확인
    const user = await prisma.account.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }
    const uniqueName = await prisma.character.findFirst({
      where: { characterName: name },
    });

    if (uniqueName) {
      return res.status(403).json({ message: "이미 존재하는 이름입니다." });
    }

    // 캐릭터 생성
    const character = await prisma.character.create({
      data: {
        userName: user.userName, // 사용자 이름을 캐릭터에 설정
        characterName: name, // 캐릭터 이름 설정
        characterImage: image, // 캐릭터 이미지 설정
        account: { connect: { id: userId } }, // 계정과 연결
      },
    });
    const inventory = await prisma.inventory.create({
      data: {
        userName: user.userName, // 사용자 이름을 인벤토리에 설정
        userId: user.id,
        chracterName: name, // 캐릭터 이름을 인벤토리에 설정
        money: 10000, // 초기 자금 설정
        character: { connect: { id: character.id } }, // 생성된 캐릭터와 연결
      },
    });

    return res.status(201).json(character);
  } catch (error) {
    console.error("캐릭터 생성 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "캐릭터 생성 실패", error: error.message });
  }
});
//#endregion

//#region 캐릭터들가져오기
router.get("/characters/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    console.log("캐릭터 가져오기 시도" + `${userName}`);
    const characters = await prisma.character.findMany({
      where: { userName },
    });
    console.log(characters);
    res.status(200).json(characters);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "캐릭터 조회 실패", error });
  }
});
//#endregion

//#region 캐릭터 하나 가져오기

router.get("/character/:characterId", async (req, res) => {
  try {
    const { characterId } = req.params;
    console.log("캐릭터 가져오기 시도" + `${characterId}`);
    const character = await prisma.character.findFirst({
      where: { id: characterId },
    });
    console.log(character);
    res.status(200).json(character);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "캐릭터 조회 실패", error });
  }
});

//#endregion

//#region 캐릭터 삭제
router.delete("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params; // URL에서 characterId를 추출

  try {
    // 캐릭터 삭제
    const deletedCharacter = await prisma.character.delete({
      where: {
        id: characterId, // 삭제할 캐릭터의 ID
      },
    });
    console.log("제거 시도" + characterId);

    // 삭제된 캐릭터 정보를 응답
    res.status(200).json(deletedCharacter);
  } catch (error) {
    console.error("캐릭터 삭제 중 오류 발생:", error);

    if (error.code === "P2025") {
      // 캐릭터가 존재하지 않을 때의 처리
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    res.status(500).json({ message: "서버 오류", error: error.message });
  }
});
//#endregion

//#region Backup
/*
//#region 캐릭터 생성
// 캐릭터 생성
router.post("/character", authenticateJWT, async (req, res) => {
  const isLogin = req.session.userId;

  if (!isLogin) {
    return res
      .status(401)
      .json({ success: false, mesaage: "로그인을 해주세요." });
  }

  console.log("캐릭터 생성 호출 했어");
  const { nickName } = req.body; // 요청 본체에서 nickName 얻기

  if (!nickName) {
    return res
      .status(400)
      .json({ success: false, mesaage: "닉네임을 입력해주세요." });
  }

  try {
    const preCharacter = await prisma.character.findFirst({
      where: {
        nickName,
      },
    });

    if (preCharacter) {
      return res
        .status(409)
        .json({ success: false, message: "이미 사용중인 닉네임 입니다." });
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

    return res.status(201).json({ success: true, newCharacter });
  } catch (error) {
    console.error("캐릭터 생성 중 오류 발생:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
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
*/
//#endregion
export default router;
