-- Create posts table for Telegram landing page
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    preview TEXT NOT NULL,
    image_url TEXT,
    reactions JSONB NOT NULL DEFAULT '{}',
    views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Insert sample posts
INSERT INTO posts (title, preview, image_url, reactions, views, created_at) VALUES
('INBOUND_2025_30_Charts', 'Неделю назад на одной из самых крутых конференций по маркетингу INBOUND уважаемый дядька Нил Патель рассказал, к чему надо быть готовым в маркетинге...', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', '{"🔥": 11, "❤️": 6, "⚡": 4}', 378, NOW() - INTERVAL '7 days'),
('Как мы получили $2M инвестиций через контент маркетинг', '3 главных инсайта от запуска стартапа, которые работают и сейчас. Делюсь опытом 🚀', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', '{"🔥": 24, "👍": 18, "💪": 7}', 892, NOW() - INTERVAL '3 days');