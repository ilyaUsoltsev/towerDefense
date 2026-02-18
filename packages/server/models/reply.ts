import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import type { Reaction } from './reaction';

interface ReplyAttributes {
  id: number;
  content: string;
  userid: number;
  commentid: number; // на какой комментарий отвечаем
  createdAt?: Date;
  updatedAt?: Date;
}

type ReplyCreationAttributes = Optional<
  ReplyAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class Reply
  extends Model<ReplyAttributes, ReplyCreationAttributes>
  implements ReplyAttributes
{
  declare id: number;
  declare content: string;
  declare userid: number;
  declare commentid: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare reactions?: Reaction[];
}

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    commentid: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Reply',
    tableName: 'replies',
    paranoid: true,
    indexes: [{ fields: ['commentid', 'createdAt'] }, { fields: ['userid'] }],
  }
);

export { Reply };
