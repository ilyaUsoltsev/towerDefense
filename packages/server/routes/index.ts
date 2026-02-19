import { Router } from 'express';
import { topicController } from '../controller/topic';
import { commentController } from '../controller/comment';
import { replyController } from '../controller/reply';
import { reactionController } from '../controller/reaction';

const router = Router();

// Topics
router.get('/topics', topicController.getAll);
router.get('/topics/:id', topicController.getOne);
router.post('/topics', topicController.create);
router.put('/topics/:id', topicController.update);
router.delete('/topics/:id', topicController.delete);

// Comments
router.get('/topics/:topicId/comments', commentController.getByTopic);
router.post('/topics/:topicId/comments', commentController.create);
router.put('/topics/:topicId/comments/:id', commentController.update);
router.delete('/topics/:topicId/comments/:id', commentController.delete);

// Replies
router.get('/comments/:commentId/replies', replyController.getByComment);
router.post('/comments/:commentId/replies', replyController.create);

// Reactions (toggle)
router.post('/comments/:commentId/reactions', reactionController.toggle);
router.post('/replies/:replyId/reactions', reactionController.toggle);
router.get(
  '/comments/:commentId/reactions/count',
  reactionController.getCounts
);
router.get('/replies/:replyId/reactions/count', reactionController.getCounts);

export default router;
