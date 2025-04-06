import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewEntry from '../components/newEntry';

const NewJournal: React.FC = () => {
  const navigate = useNavigate();

  // Called when a new entry is successfully created
  const handleEntryCreated = (createdEntry: any) => {
    console.log('New journal entry created:', createdEntry);
    // Navigate to the journal entries page to see the updated list
    navigate('/entries');
  };

  return (
    <div className="new-journal-page">
      <NewEntry onEntryCreated={handleEntryCreated} />
    </div>
  );
};

export default NewJournal;
