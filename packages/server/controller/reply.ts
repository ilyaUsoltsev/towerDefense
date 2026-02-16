import type { Request, Response } from 'express';
import { Reply, Comment } from '../models';

export const replyController = {
  async create(req: Request, res: Response) {
    try {
      const { commentid } = req.params;
      const { content } = req.body;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      if (!content?.trim()) {
        return res.status(400).json({ error: 'Содержимое ответа обязательно' });
      }

      const parentComment = await Comment.findByPk(Number(commentid));
      if (!parentComment) {
        return res.status(404).json({ error: 'Комментарий не найден' });
      }

      const reply = await Reply.create({
        content,
        userid,
        commentid: Number(commentid),
      });

      return res.status(201).json(reply);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка создания ответа' });
    }
  },

  async getByComment(req: Request, res: Response) {
    try {
      const { commentid } = req.params;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      const replies = await Reply.findAll({
        where: { commentid: Number(commentid) },
        order: [['createdAt', 'ASC']],
        include: ['reactions'],
      });

      return res.json(replies);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка получения ответов' });
    }
  },
};
