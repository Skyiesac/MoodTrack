import React, { useEffect, useState } from 'react';
import JournalEntry from '../components/journalEntry';
import { getEntries, deleteEntry } from '../utils/api';

interface Entry {
  id: number;
  date: string;
  emotion: string;
  timeOfDay: string;
  text: string;
}

const JournalEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries();
        setEntries(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch entries');
      }
    };

    fetchEntries();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete the entry');
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit entry with id:', id);
  };

  return (
    <div className="journal-entries-page">
      <h2>My Journal Entries</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {entries.length === 0 && !error && <p>You have no journal entries yet.</p>}
      {entries.map((entry) => (
        <JournalEntry
          key={entry.id}
          date={entry.date}
          emotion={entry.emotion}
          timeOfDay={entry.timeOfDay}
          text={entry.text}
          onDelete={() => handleDelete(entry.id)}
          onEdit={() => handleEdit(entry.id)}
        />
      ))}
    </div>
  );
};

export default JournalEntries;
