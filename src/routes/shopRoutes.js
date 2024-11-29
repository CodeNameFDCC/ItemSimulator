import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//#region 상점추가

// 상점 추가
router.post("/shop", async (req, res) => {
  const { name, desc } = req.body;

  // 필수 정보 확인
  if (!name || !desc) {
    return res.status(400).json({ message: "상점 이름과 설명이 필요합니다." });
  }

  try {
    // 새로운 상점 생성
    const newShop = await prisma.shop.create({
      data: {
        name,
        desc,
      },
    });

    res.status(201).json(newShop); // 생성된 상점 정보 반환
  } catch (error) {
    console.error("상점 추가 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 상점 리스트 조회

//상점 리스트 조회

router.get("/shop", async (req, res) => {
  try {
    // 모든 상점 조회
    const shops = await prisma.shop.findMany();

    res.status(200).json(shops); // 상점 리스트 반환
  } catch (error) {
    console.error("상점 리스트 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 지정 상점 아이템 추가

//지정 상점 아이템 추가
router.post("/shop/:shopId/items", async (req, res) => {
  const { shopId } = req.params; // URL에서 상점 ID 가져오기
  const { img, type, name, desc, price, addAtk, addDfense, addHealth } =
    req.body;

  // 필수 정보 확인
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
      .status(400)
      .json({ message: "모든 필수 정보를 제공해야 합니다." });
  }

  try {
    // 상점이 존재하는지 확인
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({ message: "상점을 찾을 수 없습니다." });
    }

    // 아이템 생성 (인벤토리 연결 생략)
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
        shop: {
          connect: { id: shopId }, // 상점과 연결
        },
        // 인벤토리 연결 제거
      },
    });

    res.status(201).json(newItem); // 생성된 아이템 반환
  } catch (error) {
    console.error("아이템 추가 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//#endregion

//#region 지정상점아이템 조회
router.get("/shop/:shopId/items", async (req, res) => {
  const { shopId } = req.params; // URL에서 상점 ID 가져오기

  try {
    // 상점이 존재하는지 확인
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { items: true }, // 상점의 아이템 포함하여 조회
    });

    if (!shop) {
      return res.status(404).json({ message: "상점을 찾을 수 없습니다." });
    }

    res.status(200).json(shop.items); // 상점의 아이템 리스트 반환
  } catch (error) {
    console.error("상점 아이템 리스트 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
//#endregion

//#region  아이템 구매
//아이템 구매
router.post("/shop/buy/:itemId", authenticateJWT, async (req, res) => {
  const isLogin = req.session.userId;
  const isSelectCharacter = req.session.selectCharacter;
  const itemId = req.params.itemId;

  if (!isLogin) {
    return res.status(400).json({ message: "로그인 부터 해주세요." });
  }
  if (!isSelectCharacter) {
    return res.status(400).json({ message: "캐릭터가 선택되지 않았습니다." });
  }
  if (!itemId) {
    return res.status(400).json({ message: "아이템 아이디가 없습니다." });
  }

  try {
    // 캐릭터 정보 가져오기
    const character = await prisma.character.findFirst({
      where: { id: isSelectCharacter },
    });

    if (!character) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    // 아이템 정보 가져오기
    const item = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 사용자 gold 확인
    if (character.gold < item.price) {
      return res.status(400).json({ message: "재화가 부족합니다." });
    }

    // 인벤토리 확인
    const inventory = await prisma.inventory.findFirst({
      where: { characterId: character.id },
    });

    if (!inventory) {
      return res.status(400).json({ message: "인벤토리를 찾을수 없습니다." });
    }

    // 구매 처리: gold 차감
    await prisma.character.update({
      where: { id: character.id },
      data: {
        gold: character.gold - item.price,
      },
    });

    await prisma.item.create({
      data: {
        img: item.img,
        type: item.type,
        name: item.name,
        desc: item.desc,
        price: item.price,
        addAtk: item.addAtk,
        addDfense: item.addDfense,
        addHealth: item.addHealth,
        inventory: {
          connect: { id: inventory.id },
        },
      },
    });

    res.status(200).json({ message: "아이템 구매 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

//#endregion

//#region 아이템 판매
//지정 아이템 판매

router.post("/shop/sell/:itemId", authenticateJWT, async (req, res) => {
  const isLogin = req.session.userId;
  const isSelectCharacter = req.session.selectCharacter;
  const itemId = req.params.itemId;

  if (!isLogin) {
    return res.status(400).json({ message: "로그인 부터 해주세요." });
  }
  if (!isSelectCharacter) {
    return res.status(400).json({ message: "캐릭터가 선택되지 않았습니다." });
  }
  if (!itemId) {
    return res.status(400).json({ message: "아이템 아이디가 없습니다." });
  }

  try {
    // 캐릭터 정보 가져오기
    const character = await prisma.character.findFirst({
      where: { id: isSelectCharacter },
    });

    if (!character) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    // 아이템 정보 가져오기
    const item = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 인벤토리 확인
    const inventory = await prisma.inventory.findFirst({
      where: {
        id: item.invenId,
      },
    });

    if (!inventory) {
      return res.status(400).json({ message: "인벤토리를 찾을수 없습니다." });
    }

    // 판매 처리: gold 증가
    await prisma.character.update({
      where: { id: character.id },
      data: {
        gold: character.gold + item.price,
      },
    });

    res.status(200).json({ message: "아이템 판매 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

//#endregion

export default router;
