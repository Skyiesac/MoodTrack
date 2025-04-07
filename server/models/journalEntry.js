import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface JournalEntryAttributes {
  id: number;
  date: Date;
  emotion: string;
  text: string;
  userId: number;
}

interface JournalEntryCreationAttributes extends Optional<JournalEntryAttributes, 'id'> {}

export class JournalEntry
  extends Model<JournalEntryAttributes, JournalEntryCreationAttributes>
  implements JournalEntryAttributes
{
  public id!: number;
  public date!: Date;
  public emotion!: string;
  public text!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any): void {
    JournalEntry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export function JournalEntryFactory(sequelize: Sequelize): typeof JournalEntry {
  JournalEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      emotion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'journal_entries',
      sequelize,
      underscored: true,
    }
  );

  return JournalEntry;
}