-- File: backend/migrations/005_create_ratings.sql
-- Jalankan query ini di Supabase SQL Editor

-- Drop table jika sudah ada (untuk reset)
DROP TABLE IF EXISTS ratings;

-- Buat tabel ratings
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  user_ip VARCHAR(45) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(article_id, user_ip)
);

-- Tambah index untuk performance
CREATE INDEX idx_ratings_article_id ON ratings(article_id);
CREATE INDEX idx_ratings_user_ip ON ratings(user_ip);

-- Update tabel articles untuk menambah kolom rating
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Update existing articles dengan rating 0
UPDATE articles SET average_rating = 0.00, total_ratings = 0 WHERE average_rating IS NULL;