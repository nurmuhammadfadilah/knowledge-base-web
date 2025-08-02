-- Tabel Ratings
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_ip VARCHAR(45) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_ip)
);

-- Indexes untuk ratings
CREATE INDEX idx_ratings_article_id ON ratings(article_id);
CREATE INDEX idx_ratings_user_ip ON ratings(user_ip);
