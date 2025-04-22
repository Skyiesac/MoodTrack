import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { entriesAPI } from '../../services/api.js';

// Async thunks
export const createEntry = createAsyncThunk(
  'entries/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await entriesAPI.createEntry(entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create entry');
    }
  }
);

export const getEntries = createAsyncThunk(
  'entries/getEntries',
  async (params, { rejectWithValue }) => {
    try {
      const response = await entriesAPI.getEntries(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch entries');
    }
  }
);

export const getEntry = createAsyncThunk(
  'entries/getEntry',
  async (id, { rejectWithValue }) => {
    try {
      const response = await entriesAPI.getEntry(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch entry');
    }
  }
);

export const updateEntry = createAsyncThunk(
  'entries/updateEntry',
  async ({ id, entryData }, { rejectWithValue }) => {
    try {
      const response = await entriesAPI.updateEntry(id, entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update entry');
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await entriesAPI.deleteEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete entry');
    }
  }
);

export const getMoodStats = createAsyncThunk(
  'entries/getMoodStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await entriesAPI.getMoodStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch mood stats');
    }
  }
);

const initialState = {
  entries: [],
  currentEntry: null,
  moodStats: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1
  },
  loading: false,
  error: null
};

const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Entry
      .addCase(createEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload.entry);
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Entries
      .addCase(getEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Entry
      .addCase(getEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntry = action.payload.entry;
      })
      .addCase(getEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Entry
      .addCase(updateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(e => e.id === action.payload.entry.id);
        if (index !== -1) {
          state.entries[index] = action.payload.entry;
        }
        state.currentEntry = action.payload.entry;
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Entry
      .addCase(deleteEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(e => e.id !== action.payload);
        if (state.currentEntry?.id === action.payload) {
          state.currentEntry = null;
        }
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Mood Stats
      .addCase(getMoodStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMoodStats.fulfilled, (state, action) => {
        state.loading = false;
        state.moodStats = action.payload.stats;
      })
      .addCase(getMoodStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentEntry, clearError, setPage } = entriesSlice.actions;
export default entriesSlice.reducer;
