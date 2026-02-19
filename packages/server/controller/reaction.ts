import type { Request, Response } from 'express';
import { Reaction } from '../models';
import { Op, fn, col } from 'sequelize';
import {
  REACTION_TYPE_VALUES,
  type ReactionType,
} from '../models/reactionTypes';

export const reactionController = {
  // Поставить / убрать реакцию (toggle)
  async toggle(req: Request, res: Response) {
    try {
      const userid = (req as any).user?.id;
      if (!userid) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      const { commentid, replyid } = req.params;

      const rawType = req.body;

      const commentidNum = Number(commentid);
      if (isNaN(commentidNum) || commentidNum <= 0) {
        return res.status(400).json({
          error: 'commentid должен быть положительным числом',
        });
      }

      const replyidNum = Number(replyid);
      if (isNaN(replyidNum) || replyidNum <= 0) {
        return res.status(400).json({
          error: 'replyid должен быть положительным числом',
        });
      }

      let normalizedType: string | null = null;
      if (rawType != null) {
        normalizedType = String(rawType).trim().toLowerCase();
      }

      if (
        !normalizedType ||
        !REACTION_TYPE_VALUES.includes(normalizedType as ReactionType)
      ) {
        return res.status(400).json({
          error: 'Недопустимый тип реакции',
          received: rawType,
          allowed: REACTION_TYPE_VALUES,
        });
      }

      const type = normalizedType as ReactionType;

      const whereClause: any = {
        userid,
        type,
      };

      let targetType: 'comment' | 'reply' | null = null;

      if (commentid) {
        whereClause.commentid = Number(commentid);
        whereClause.replyid = { [Op.is]: null };
        targetType = 'comment';
      } else if (replyid) {
        whereClause.replyid = Number(replyid);
        whereClause.commentid = { [Op.is]: null };
        targetType = 'reply';
      } else {
        return res.status(400).json({ error: 'Укажите commentid или replyid' });
      }

      const existing = await Reaction.findOne({ where: whereClause });

      if (existing) {
        await existing.destroy();
        return res.json({ action: 'removed', type });
      }

      const reaction = await Reaction.create({
        type,
        userid,
        commentid: targetType === 'comment' ? Number(commentid) : null,
        replyid: targetType === 'reply' ? Number(replyid) : null,
      });

      return res.status(201).json({ action: 'added', type, reaction });
    } catch (error: any) {
      console.error('Ошибка в toggle реакции:', error);
      return res.status(500).json({ error: 'Ошибка работы с реакцией' });
    }
  },

  async getCounts(req: Request, res: Response) {
    try {
      const { commentid, replyid } = req.params;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
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
