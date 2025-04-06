// Collects user input (emotion, time, text) to create a new journal entry.
// Submits data to the server and resets the form on success.

import React, { useState } from 'react';
import { createEntry } from '../utils/api'; 

interface NewEntryProps {
  onEntryCreated?: (entry: any) => void;
}

const NewEntry: React.FC<NewEntryProps> = ({ onEntryCreated }) => {
  
    // State hooks for form fields
  const [emotion, setEmotion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [text, setText] = useState('');

  // Optional states for handling success/error messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

interface EntryData {
    emotion: string;
    timeOfDay: string;
    text: string;
    date: string;
    title: string;
    content: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
        // Prepare data to send to the server
        const entryData: EntryData = {
            emotion,
            timeOfDay,
            text,
            // Could also pass a date if the server needs it
            date: new Date().toISOString().split('T')[0],
            title: 'Default Title', // Add a title property
            content: text // Add a content property
        };

        // Call your API function to create an entry
        const createdEntry = await createEntry(entryData);
        
        // If successful, set a success message
        setSuccessMsg('Your journal entry has been saved!');
        
        // If you want to update the parent component or a list page
        if (onEntryCreated) {
            onEntryCreated(createdEntry);
        }

        // Reset the form fields
        setEmotion('');
        setTimeOfDay('morning');
        setText('');

    } catch (err: any) {
        // Display any error that might occur
        setErrorMsg(err.message || 'Failed to create entry.');
    }
};

  return (
    <div className="new-entry-container">
      <h2>Create New Journal Entry</h2>

      {/* Display error or success messages */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="emotion">Emotion:</label>
        <select
          id="emotion"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        >
          <option value="">Select emotion</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="calm">Calm</option>
          <option value="anxious">Anxious</option>
          <option value="neutral">Neutral</option>
          {/* Add more as we like */}
        </select>

        <label htmlFor="timeOfDay">Time of Day:</label>
        <select
          id="timeOfDay"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
          required
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>

        <label htmlFor="text">Journal Text:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about your day or how you're feeling..."
          required
        />

        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default NewEntry;
