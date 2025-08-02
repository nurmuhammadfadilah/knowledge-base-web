-- Tabel Articles
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes untuk articles
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
