const API_BASE_URL = '/api';

export const api = {
  async getEntries() {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch entries');
    return response.json();
  },

  async createEntry(entry) {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: entry.date,
        mood: entry.mood,
        content: entry.content,
        tags: entry.tags,
      }),
    });
    if (!response.ok) throw new Error('Failed to create entry');
    return response.json();
  },

  async getEntry(id) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch entry');
    return response.json();
  },

  async updateEntry(id, entry) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: entry.date,
        mood: entry.mood,
        content: entry.content,
        tags: entry.tags,
      }),
    });
    if (!response.ok) throw new Error('Failed to update entry');
    return response.json();
  },

  async deleteEntry(id) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete entry');
    if (response.status === 204) return null;
    return response.json();
  }
};