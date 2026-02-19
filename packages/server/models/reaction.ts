import { DataTypes, Model, Optional, Op } from 'sequelize';
import { sequelize } from '../db';
import { REACTION_TYPE_VALUES, type ReactionType } from '../types/reaction';

interface ReactionAttributes {
  id: number;
  type: ReactionType;
  userid: number;
  commentid: number | null;
  replyid: number | null;
  createdAt?: Date;
}

type ReactionCreationAttributes = Optional<
  ReactionAttributes,
  'id' | 'createdAt'
>;

class Reaction
  extends Model<ReactionAttributes, ReactionCreationAttributes>
  implements ReactionAttributes
{
  declare id: number;
  declare type: ReactionType;
  declare userid: number;
  declare commentid: number | null;
  declare replyid: number | null;
  declare readonly createdAt: Date;
}

Reaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(...REACTION_TYPE_VALUES),
      allowNull: false,
    },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    commentid: { type: DataTypes.INTEGER, allowNull: true },
    replyid: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Reaction',
    tableName: 'reactions',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['userid', 'commentid', 'type'],
        where: { commentid: { [Op.ne]: null } },
      },
      {
        unique: true,
        fields: ['userid', 'replyid', 'type'],
        where: { replyid: { [Op.ne]: null } },
      },
      { fields: ['commentid'] },
      { fields: ['replyid'] },
    ],
    validate: {
      exactlyOneTarget() {
        if ((this.commentid == null) === (this.replyid == null)) {
          throw new Error(
            'Реакция должна быть либо к комментарию, либо к ответу (ровно одно поле)'
          );
        }
      },
    },
  }
);

export { Reaction };
