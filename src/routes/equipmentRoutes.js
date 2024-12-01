import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//#region 아이템 착용 토글

//#region 아이템 착용/해제
router.patch("/item/equip/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 아이템 존재 여부 확인
    const item = await prisma.item.findUnique({
      where: { id: id },
    });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 현재 isEquip 상태를 토글
    const updatedItem = await prisma.item.update({
      where: { id: id },
      data: { isEquip: !item.isEquip },
    });
    const calc = updatedItem.isEquip ? 1 : -1;

    const character = await prisma.character.findFirst({
      where: { id: item.characterId },
    });

    const updatedCharacter = await prisma.character.update({
      where: { id: item.characterId },
      data: {
        damage: character.damage + item.addDamage * calc,
        health: character.health + item.addHealth * calc,
        defense: character.defense + item.addDefense * calc,
        atkspd: character.atkspd + item.addAtkSpd * calc,
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("아이템 착용/해제 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "아이템 착용/해제 실패", error: error.message });
  }
});
//#endregion

//#endregion

//#region Backup
/*
//#region 아이템 착용
router.post("/equip", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;

  if (!userId) {
    return res.status(401).json({ message: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ message: "캐릭터 선택을 먼저 해주세요" });
  }
  const { itemId } = req.body;

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { inventory: true },
    });

    if (!item || !character) {
      return res
        .status(404)
        .json({ error: "아이템 또는 캐릭터를 찾을 수 없습니다." });
    }

    if (item.invenId) {
      return res
        .status(404)
        .json({ error: "해당 아이템은 인벤토리에 없습니다." });
    }

    const inventoryItem = await prisma.inventory.findFirst({
      where: { id: item.invenId },
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: "해당 아이템은 인벤토리에 없습니다." });
    }

    // 아이템을 인벤토리에서 제거하고, 장비에 추가
    await prisma.inventory.update({
      where: { characterId: characterId },
      data: {
        items: {
          disconnect: { id: itemId },
        },
      },
    });

    // 아이템을 장비에 추가
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        equipment: {
          connect: { characterId: characterId },
        },
      },
    });

    // 캐릭터 스텟 업데이트
    await prisma.character.update({
      where: { id: characterId },
      data: {
        atkDmg: { increment: item.addAtk },
        dfense: { increment: item.addDfense },
        health: { increment: item.addHealth },
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//#endregion

//#region 아이템 해제
router.post("/unequip", authenticateJWT, async (req, res) => {
  const userId = req.session.userId;
  const characterId = req.session.selectCharacter;

  if (!userId) {
    return res.status(401).json({ message: "로그인을 해주세요." });
  }
  if (!characterId) {
    return res.status(401).json({ message: "캐릭터 선택을 먼저 해주세요" });
  }

  const { itemId } = req.body;

  try {
    // 캐릭터와 장비 정보 가져오기
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { equipment: true },
    });

    if (!character) {
      return res.status(404).json({ error: "캐릭터를 찾을 수 없습니다." });
    }

    // 아이템을 장비에서 제거
    await prisma.equipment.update({
      where: { characterId: characterId },
      data: {
        items: {
          disconnect: { id: itemId },
        },
      },
    });

    // 아이템을 인벤토리에 추가
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        inventory: {
          connect: { characterId: characterId },
        },
      },
    });

    await prisma.character.update({
      where: { id: characterId },
      data: {
        atkDmg: { decrement: item.addAtk },
        dfense: { decrement: item.addDfense },
        health: { decrement: item.addHealth },
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//#endregion
*/
//#endregion

export default router;
