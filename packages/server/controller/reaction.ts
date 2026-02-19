import type { Request, Response } from 'express';
import { Comment, Reaction, Reply } from '../models';
import { Op, fn, col } from 'sequelize';
import {
  REACTION_TYPE_VALUES,
  type ReactionType,
} from '../models/reactionTypes';

export const reactionController = {
  // Поставить / убрать реакцию (toggle)
  async toggle(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Требуется авторизация' });

    const { commentid, replyid } = req.params;
    const typeRaw = req.body?.type; // ← ожидаем { "type": "like" }

    if (!typeRaw || typeof typeRaw !== 'string') {
      return res
        .status(400)
        .json({ error: 'Поле type обязательно и должно быть строкой' });
    }

    const type = typeRaw.trim().toLowerCase() as ReactionType;
    if (!REACTION_TYPE_VALUES.includes(type)) {
      return res.status(400).json({
        error: 'Недопустимый тип реакции',
        allowed: REACTION_TYPE_VALUES,
      });
    }

    let targetId: number | null = null;
    let isComment = false;

    if (commentid && !replyid) {
      targetId = Number(commentid);
      isComment = true;
      if (isNaN(targetId) || targetId <= 0) {
        return res.status(400).json({ error: 'Некорректный commentid' });
      }
    } else if (replyid && !commentid) {
      targetId = Number(replyid);
      if (isNaN(targetId) || targetId <= 0) {
        return res.status(400).json({ error: 'Некорректный replyid' });
      }
    } else {
      return res
        .status(400)
        .json({
          error: 'Укажите ровно один из параметров: commentid или replyid',
        });
    }

    const where = {
      userid: userId,
      type,
      ...(isComment
        ? { commentid: targetId, replyid: { [Op.is]: null } }
        : { replyid: targetId, commentid: { [Op.is]: null } }),
    };

    const existing = await Reaction.findOne({ where });

    if (existing) {
      await existing.destroy();
      return res.json({ action: 'removed', type });
    }

    // Проверяем существование родителя (очень желательно)
    if (isComment) {
      const exists = await Comment.findByPk(targetId, { attributes: ['id'] });
      if (!exists)
        return res.status(404).json({ error: 'Комментарий не найден' });
    } else {
      const exists = await Reply.findByPk(targetId, { attributes: ['id'] });
      if (!exists) return res.status(404).json({ error: 'Ответ не найден' });
    }

    const reaction = await Reaction.create({
      type,
      userid: userId,
      commentid: isComment ? targetId : null,
      replyid: isComment ? null : targetId,
    });

    return res.status(201).json({ action: 'added', type, reaction });
  },

  async getCounts(req: Request, res: Response) {
    try {
      const { commentid, replyid } = req.params;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      const where: any = {};
      if (commentid) where.commentid = Number(commentid);
      if (replyid) where.replyid = Number(replyid);

      const counts = await Reaction.findAll({
        where,
        attributes: ['type', [fn('COUNT', col('id')), 'count']],
        group: ['type'],
      });

      return res.json(counts);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка подсчёта реакций' });
    }
  },
};
