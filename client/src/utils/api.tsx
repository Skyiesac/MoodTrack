import axios from 'axios';

// Represents a journal entry.
export interface Entry {
  id: number;
  date: string;
  emotion: string;
  timeOfDay: string;
  text: string;
}

// Data for creating a new journal entry (without the `id` field).
export type NewEntryData = Omit<Entry, 'id'>;

const apiClient = axios.create({
baseURL: 'http://localhost:3000', // WE WILL NEED TO UPDATE THIS URL with the BACKEND URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all journal entries.
export async function getEntries(): Promise<Entry[]> {
  const response = await apiClient.get<Entry[]>('/api/entries');
  return response.data;
}

// Create a new journal entry.
export async function createEntry(data: NewEntryData): Promise<Entry> {
  const response = await apiClient.post<Entry>('/entries', data);
  return response.data;
}

// Delete a journal entry by ID.
export async function deleteEntry(id: number): Promise<void> {
  await apiClient.delete(`/api/entries/${id}`);
}
