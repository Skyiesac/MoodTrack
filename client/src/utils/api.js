const API_BASE_URL = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async getEntries() {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      credentials: 'include',
      headers: getAuthHeader(),
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
        ...getAuthHeader(),
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
      headers: getAuthHeader(),
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
        ...getAuthHeader(),
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
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete entry');
    if (response.status === 204) return null;
    return response.json();
  }
};
