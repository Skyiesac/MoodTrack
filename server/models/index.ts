import { User } from './user';
import { MoodEntry } from './mood-entry';
import { Tag } from './tag';
import sequelize from './db';

// Define relationships
User.hasMany(MoodEntry, {
  foreignKey: 'userId',
  as: 'moodEntries'
});

MoodEntry.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

MoodEntry.belongsToMany(Tag, {
  through: 'mood_entry_tags',
  foreignKey: 'moodEntryId',
  as: 'tags'
});

Tag.belongsToMany(MoodEntry, {
  through: 'mood_entry_tags',
  foreignKey: 'tagId',
  as: 'moodEntries'
});

export { sequelize, User, MoodEntry, Tag };