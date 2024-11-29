import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { authenticateJWT } from "../middlewares/auth.jwt.middleware.js";

const router = express.Router();

//#region 아이템 착용
router.post("/equip", async (req, res) => {
  const { characterId, itemId } = req.body;

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

    // 아이템을 인벤토리에서 제거하고, 장비에 추가
    await prisma.inventory.update({
      where: { characterId: characterId },
      data: {
        items: {
          disconnect: { id: itemId },
        },
      },
    });

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        equipment: {
          connect: { characterId: characterId },
        },
        invenId: null, // 인벤토리 ID를 null로 설정
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//#endregion

//#region 아이템 해제
router.post("/unequip", async (req, res) => {
  const { characterId, itemId } = req.body;

  try {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { equipment: true },
    });

    if (!character) {
      return res.status(404).json({ error: "캐릭터를 찾을 수 없습니다." });
    }

    // 아이템을 장비에서 제거하고, 인벤토리에 추가
    await prisma.equipment.update({
      where: { characterId: characterId },
      data: {
        items: {
          disconnect: { id: itemId },
        },
      },
    });

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        inventory: {
          connect: { characterId: characterId },
        },
        equipId: null, // 장비 ID를 null로 설정
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//#endregion

export default router;
