import React from 'react';

// Define the props your JournalEntry will receive
interface JournalEntryProps {
  date: string;
  emotion: string;
  timeOfDay: string;
  text: string;
  onDelete?: () => void; // callback for deletion
  onEdit?: () => void;   // callback for editing
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  date,
  emotion,
  timeOfDay,
  text,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="journal-entry">
      <h3>{date}</h3>
      <p>
        <strong>Emotion:</strong> {emotion}
      </p>
      <p>
        <strong>Time of Day:</strong> {timeOfDay}
      </p>
      <p>{text}</p>

      {/* Render Edit and Delete buttons if respective callbacks are provided */}
      {(onEdit || onDelete) && (
        <div className="journal-entry-actions">
          {onEdit && (
            <button onClick={onEdit} className="edit-btn">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="delete-btn">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
