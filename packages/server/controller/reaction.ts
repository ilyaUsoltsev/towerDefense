import type { Request, Response } from 'express';
import { Reaction } from '../models';
import { Op, fn, col } from 'sequelize';

export const reactionController = {
  // Поставить / убрать реакцию (toggle)
  async toggle(req: Request, res: Response) {
    try {
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id ?? 1;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      const { type } = req.body;
      const { commentid, replyid } = req.params;

      // Валидация типа реакции
      const allowedTypes = [
        'like',
        'dislike',
        'love',
        'haha',
        'wow',
        'sad',
        'angry',
      ];
      if (!type || !allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Недопустимый тип реакции' });
      }

      const whereClause: any = {
        userid: userid,
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
      return res
        .status(500)
        .json({ error: 'Ошибка работы с реакцией', details: error.message });
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
