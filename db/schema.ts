import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db"; // Ensure `sequelize` is imported from your DB configuration

// Users table
export class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

// Mood entries table
export class MoodEntry extends Model {}
MoodEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    mood: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "MoodEntry",
    tableName: "mood_entries",
    timestamps: false,
  }
);

// Tags table
export class Tag extends Model {}
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
    timestamps: false,
  }
);

// MoodEntryTags (junction table)
export class MoodEntryTag extends Model {}
MoodEntryTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mood_entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MoodEntry,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "MoodEntryTag",
    tableName: "mood_entry_tags",
    timestamps: false,
  }
);

// Relationships
User.hasMany(MoodEntry, { foreignKey: "user_id", as: "moodEntries" });
MoodEntry.belongsTo(User, { foreignKey: "user_id", as: "user" });

MoodEntry.hasMany(MoodEntryTag, { foreignKey: "mood_entry_id", as: "moodEntryTags" });
MoodEntryTag.belongsTo(MoodEntry, { foreignKey: "mood_entry_id", as: "moodEntry" });

Tag.hasMany(MoodEntryTag, { foreignKey: "tag_id", as: "moodEntryTags" });
MoodEntryTag.belongsTo(Tag, { foreignKey: "tag_id", as: "tag" });

export { sequelize };
