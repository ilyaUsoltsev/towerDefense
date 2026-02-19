import type { Request, Response } from 'express';
import { Topic, Comment, Reply } from '../models';

export const topicController = {
  async getAll(req: Request, res: Response) {
    try {
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }

      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: topics } = await Topic.findAndCountAll({
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        topics,
        total: count,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error: any) {
      return res.status(500).json({
        error: 'Ошибка получения списка топиков',
        details: error.message,
      });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(403).json({ error: 'Требуется авторизация' });
      }
      const topic = await Topic.findByPk(id, {
        include: [
          {
            model: Comment,
            as: 'comments',
            order: [['createdAt', 'ASC']],
            include: [
              {
                model: Reply,
                as: 'replies',
                order: [['createdAt', 'ASC']],
                include: ['reactions'],
              },
              'reactions',
            ],
          },
        ],
      });

      if (!topic) return res.status(404).json({ error: 'Топик не найден' });
      return res.json(topic);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'Ошибка получения топика', details: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, content } = req.body;

      const userid = (req as any).user?.id;
      if (!userid) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      if (typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: 'Содержимое топика обязательно' });
      }

      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Заголовок топика обязателен' });
      }

      const trimmed = content.trim();
      const MAX_LENGTH = 10000;
      if (trimmed.length > MAX_LENGTH) {
        return res.status(400).json({
          error: `Топик слишком длинный (максимум ${MAX_LENGTH} символов)`,
        });
      }

      const topic = await Topic.create({ title, content, userid });
      return res.status(201).json(topic);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'Ошибка создания топика', details: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const userid = (req as any).user?.id;

      if (!userid) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }

      const rawContent = req.body.content;
      const content = String(rawContent ?? '').trim();

      if (rawContent != null && typeof rawContent !== 'string') {
        return res
          .status(400)
          .json({ error: 'Поле content должно быть строкой' });
      }

      const MAX_COMMENT_LENGTH = 10000;
      if (content.length > MAX_COMMENT_LENGTH) {
        return res.status(400).json({
          error: `Топик слишком длинный (максимум ${MAX_COMMENT_LENGTH} символов)`,
        });
      }

      if (content.length === 0) {
        return res.status(400).json({ error: 'Топик не может быть пустым' });
      }
      // TODO: middleware авторизации добавит req.user

      const topic = await Topic.findByPk(id);
      if (!topic) return res.status(404).json({ error: 'Топик не найден' });
      if (topic.userid !== userid)
        return res.status(403).json({ error: 'Нет прав' });

      await topic.update({ title, content });
      return res.status(200).json(topic);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'Ошибка обновления топика', details: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // TODO: middleware авторизации добавит req.user
      const userid = (req as any).user?.id;
      if (!userid)
        return res.status(403).json({ error: 'Требуется авторизация' });
      const topic = await Topic.findByPk(id);
      if (!topic) return res.status(404).json({ error: 'Топик не найден' });
      if (topic.userid !== userid)
        return res.status(403).json({ error: 'Нет прав' });

      await topic.destroy();
      return res.status(204).send();
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'Ошибка удаления топика', details: error.message });
    }
  },
};
