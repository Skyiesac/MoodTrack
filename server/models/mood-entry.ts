import { Model, DataTypes, BelongsToManyAddAssociationsMixin, BelongsToManySetAssociationsMixin } from 'sequelize';
import sequelize from './db';
import { Tag } from './tag';

export class MoodEntry extends Model {
  declare id: number;
  declare userId: number;
  declare date: Date;
  declare mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Association methods
  declare setTags: BelongsToManySetAssociationsMixin<Tag, number>;
  declare addTags: BelongsToManyAddAssociationsMixin<Tag, number>;
  declare tags?: Tag[];
}

MoodEntry.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  mood: {
    type: DataTypes.ENUM('great', 'good', 'neutral', 'bad', 'terrible'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'MoodEntry',
  tableName: 'mood_entries',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export type MoodEntryAttributes = typeof MoodEntry.prototype;
