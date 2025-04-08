import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db';

export class Tag extends Model {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tags',
  timestamps: false,
  underscored: true
});

export type TagAttributes = typeof Tag.prototype;