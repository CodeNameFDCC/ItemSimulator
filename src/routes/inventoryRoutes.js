import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//#region 아이템 가져오기

router.get("/inventory/:characterId", async (req, res) => {
  try {
    const { characterId } = req.params;
    console.log("인벤토리 가져오기 시도" + `${characterId}`);
    const inventory = await prisma.inventory.findFirst({
      where: { characterId: characterId },
    });
    if (!inventory) {
      return res.status(401).json({ message: "인벤토리 없음", error });
    }
    const Items = await prisma.item.findMany({
      where: { inventoryId: inventory.id },
    });
    if (!Items) {
      return res.status(401).json({ message: "아이템 없음", error });
    }
    console.log(Items);
    res.status(200).json(Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "인벤토리 조회 실패", error });
  }
});
//#endregion

//#region 아이템 생성
router.post("/item", async (req, res) => {
  const { name, image, desc, characterId } = req.body;

  // 입력 값 검증
  if (!name || !image || !desc || !characterId) {
    return res.status(400).json({
      message: "이름, 이미지, 설명,사용자 ID를 모두 입력해야 합니다.",
    });
  }

  console.log(
    `이름: ${name}, 이미지: ${image},설명:${desc}, 캐릭터Id: ${characterId}`
  );

  try {
    // 캐릭터 존재 여부 확인
    const character = await prisma.character.findFirst({
      where: { id: characterId },
    });
    if (!character) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }
    const uniqueName = await prisma.item.findFirst({
      where: { itemName: name },
    });

    if (uniqueName) {
      return res.status(403).json({ message: "이미 존재하는 이름입니다." });
    }

    //아이템 생성
    const item = await prisma.item.create({
      data: {
        itemName: name,
        userId: character.accountId,
        userName: user.userName, // 사용자 이름을 아이템에 설정
        chracterName: character.characterName, // 아이템 이름 설정
        characterId: character.id,
        itemImage: image, // 아이템 이미지 설정
        inventory: { connect: { id: userId } }, // 인벤토리와 연결
        inventoryId: character.inventoryId,
      },
    });

    return res.status(201).json(character);
  } catch (error) {
    console.error("아이템 생성 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "아이템 생성 실패", error: error.message });
  }
});
//#endregion

//#region 아이템 삭제

//#endregion

//#region Backup

/*
//#region 인벤토리 아이템 추가

router.post("/inventory/item", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;

  if (!userId) {
    return res.status(401).json({ message: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ message: "캐릭터 선택을 먼저 해주세요" });
  }

  const { img, type, name, desc, price, addAtk, addDfense, addHealth } =
    req.body;
  if (
    !img ||
    !type ||
    !name ||
    !desc ||
    price === undefined ||
    addAtk === undefined ||
    addDfense === undefined ||
    addHealth === undefined
  ) {
    return res
      .status(401)
      .json({ message: "모든 입력값은 정확히 입력해 주셔야합니다." });
  }

  try {
    // 사용자의 캐릭터를 가져오기
    const character = await prisma.character.findFirst({
      where: { id: characterId },
    });

    if (!character) {
      return res
        .status(404)
        .json({ message: "사용자의 캐릭터를 찾을 수 없습니다." });
    }

    // 사용자의 인벤토리 가져오기
    const inventory = await prisma.inventory.findUnique({
      where: { characterId: character.id },
    });

    if (!inventory) {
      return res.status(404).json({ message: "인벤토리를 찾을 수 없습니다." });
    }

    // 아이템 추가
    const newItem = await prisma.item.create({
      data: {
        img,
        type,
        name,
        desc,
        price,
        addAtk,
        addDfense,
        addHealth,
        inventory: {
          connect: { id: inventory.id },
        },
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("아이템 추가 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 선택된 캐릭터 인벤토리 아이템 리스트 보기

router.get("/inventory/items", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ mesaage: "캐릭터 선택을 먼저 해주세요" });
  }

  try {
    const getInventory = await prisma.inventory.findFirst({
      where: { characterId: characterId },
    });
    if (!getInventory) {
      res
        .status(500)
        .json({ message: "인벤토리를 찾지 못하는 오류가 발생했습니다." });
    }
    const getItems = await prisma.item.findMany({
      where: { invenId: getInventory.id },
    });
    return res.status(200).json({ data: { getItems } });
  } catch (error) {
    console.error("아이템 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 선택된 캐릭터 인벤토리 아이템 제거

router.delete("/inventory/item/:itemId", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ mesaage: "캐릭터 선택을 먼저 해주세요" });
  }

  const itemId = req.params.itemId;
  if (!itemId) {
    return res.status(404).json({ message: "아이템 아이디가 잘못되었습니다." });
  }
  try {
    // 아이템이 존재하는지 확인
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 아이템 삭제
    await prisma.item.delete({
      where: { id: itemId },
    });

    return res
      .status(200)
      .json({ message: "아이템이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("아이템 삭제 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 선택된 캐릭터  인벤토리 안의 아이템 모두 제거

router.delete("/inventory/items", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;
  if (!userId) {
    return res.status(401).json({ mesaage: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ mesaage: "캐릭터 선택을 먼저 해주세요" });
  }

  try {
    const getInventory = prisma.inventory.findFirst({
      where: { charactorId: characterId },
    });

    if (!getInventory) {
      return res.status(400).json({ message: "인벤토리가 없습니다." });
    }

    await prisma.item.deleteMany({
      where: {
        invenId: getInventory.id,
      },
    });

    return res
      .status(200)
      .json({ message: "인벤토리가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("인벤토리 삭제 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion
*/
//#endregion

export default router;
