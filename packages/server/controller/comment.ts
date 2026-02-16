import type { Request, Response } from 'express';
import { Comment, Reply } from '../models';

export const commentController = {
  async create(req: Request, res: Response) {
    try {
      const { topicid } = req.params;
      const { content } = req.body;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      if (!content?.trim()) {
        return res
          .status(400)
          .json({ error: 'Содержимое комментария обязательно' });
      }

      const comment = await Comment.create({
        content,
        userid,
        topicid: Number(topicid),
      });

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка создания комментария' });
    }
  },

  async getByTopic(req: Request, res: Response) {
    try {
      const { topicid } = req.params;

      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      const comments = await Comment.findAll({
        where: { topicid: Number(topicid) },
        order: [['createdAt', 'ASC']],
        include: [
          { model: Reply, as: 'replies', include: ['reactions'] },
          'reactions',
        ],
      });

      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка получения комментариев' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;
      if (!userid)
        return res.status(403).json({ error: 'Требуется авторизация' });
      const comment = await Comment.findByPk(id);
      if (!comment)
        return res.status(404).json({ error: 'Комментарий не найден' });
      if (comment.userid !== userid)
        return res.status(403).json({ error: 'Нет прав' });
      await comment.update({ content });
      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка обновления' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;
      if (!userid)
        return res.status(403).json({ error: 'Требуется авторизация' });
      const comment = await Comment.findByPk(id);
      if (!comment)
        return res.status(404).json({ error: 'Комментарий не найден' });

      if (comment.userid !== userid)
        return res.status(403).json({ error: 'Нет прав' });

      await comment.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка удаления' });
    }
  },
};
