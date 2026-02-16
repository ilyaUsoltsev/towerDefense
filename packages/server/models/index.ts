import { Topic } from './topic';
import { Comment } from './comment';
import { Reply } from './reply';
import { Reaction } from './reaction';
import { Op } from 'sequelize';

// Topic - Comment
Topic.hasMany(Comment, {
  foreignKey: 'topicId',
  as: 'comments',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// Comment - Reply
Comment.hasMany(Reply, {
  foreignKey: 'commentId',
  as: 'replies',
  onDelete: 'CASCADE',
});
Reply.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

// Реакции
Comment.hasMany(Reaction, {
  foreignKey: 'commentId',
  as: 'reactions',
  constraints: false,
  scope: { commentId: { [Op.ne]: null } },
});
Reply.hasMany(Reaction, {
  foreignKey: 'replyId',
  as: 'reactions',
  constraints: false,
  scope: { replyId: { [Op.ne]: null } },
});

Reaction.belongsTo(Comment, {
  foreignKey: 'commentId',
  as: 'comment',
  constraints: false,
});
Reaction.belongsTo(Reply, {
  foreignKey: 'replyId',
  as: 'reply',
  constraints: false,
});

export { Topic } from './topic';
export { Comment } from './comment';
export { Reply } from './reply';
export { Reaction } from './reaction';
