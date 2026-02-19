import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import type { Comment } from './comment';

interface TopicAttributes {
  id: number;
  title: string;
  content: string;
  userid: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TopicCreationAttributes = Optional<
  TopicAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class Topic
  extends Model<TopicAttributes, TopicCreationAttributes>
  implements TopicAttributes
{
  declare id: number;
  declare title: string;
  declare content: string;
  declare userid: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare comments?: Comment[];
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
    paranoid: true,
  }
);

export { Topic };
