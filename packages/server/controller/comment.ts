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

      const topicIdNum = Number(topicid);
      if (isNaN(topicIdNum) || topicIdNum <= 0) {
        return res.status(400).json({
          error: 'topicid должен быть положительным числом',
        });
      }

      const comment = await Comment.create({
        content,
        userid,
        topicid: topicIdNum,
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
          {
            association: Comment.associations.replies,
            include: [
              {
                association: Reply.associations.reactions,
              },
            ],
          },
          {
            association: Comment.associations.reactions,
          },
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
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      const rawContent = req.body.content;
      const content = String(rawContent ?? '').trim();

      if (rawContent != null && typeof rawContent !== 'string') {
        return res
          .status(400)
          .json({ error: 'Поле content должно быть строкой' });
      }

      const MAX_COMMENT_LENGTH = 4000;
      if (content.length > MAX_COMMENT_LENGTH) {
        return res.status(400).json({
          error: `Комментарий слишком длинный (максимум ${MAX_COMMENT_LENGTH} символов)`,
        });
      }

      if (content.length === 0) {
        return res
          .status(400)
          .json({ error: 'Комментарий не может быть пустым' });
      }

      const [affectedCount, updatedComments] = await Comment.update(
        { content },
        {
          where: {
            id: Number(id),
            userid: userId,
          },
          returning: true,
        }
      );

      if (affectedCount === 0) {
        const commentExists = await Comment.findByPk(id, {
          attributes: ['id'],
        });
        if (!commentExists) {
          return res.status(404).json({ error: 'Комментарий не найден' });
        }
        return res.status(403).json({ error: 'Нет прав на редактирование' });
      }

      return res.status(200).json(updatedComments[0]);
    } catch (error) {
      console.error('Ошибка обновления комментария:', error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      const deletedCount = await Comment.destroy({
        where: {
          id: Number(id),
          userid: userId,
        },
      });

      if (deletedCount === 0) {
        const exists = await Comment.findByPk(id, { attributes: ['id'] });
        if (!exists) {
          return res.status(404).json({ error: 'Комментарий не найден' });
        }
        return res.status(403).json({ error: 'Нет прав на удаление' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },
};
