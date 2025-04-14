-- Rename timestamp columns to snake_case
ALTER TABLE mood_entries 
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE mood_entries 
  RENAME COLUMN "updatedAt" TO updated_at;

-- Rename foreign key column to snake_case (if not already)
ALTER TABLE mood_entries 
  RENAME COLUMN "userId" TO user_id;
