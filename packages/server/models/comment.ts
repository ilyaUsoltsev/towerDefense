import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import type { Reaction } from './reaction';
import type { Reply } from './reply';

interface CommentAttributes {
  id: number;
  content: string;
  userid: number;
  topicid: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  declare id: number;
  declare content: string;
  declare userid: number;
  declare topicid: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare replies?: Reply[]; // ответы на этот комментарий
  declare reactions?: Reaction[];
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    topicid: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    paranoid: true,
    indexes: [{ fields: ['topicid', 'createdAt'] }, { fields: ['userid'] }],
  }
);

export { Comment };
