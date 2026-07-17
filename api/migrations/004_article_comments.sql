-- ============================================================
-- 004_article_comments.sql — Comentarios en artículos del blog
-- ============================================================

CREATE TABLE IF NOT EXISTS article_comments (
  id            BIGSERIAL PRIMARY KEY,
  article_slug  TEXT NOT NULL,
  user_name     TEXT NOT NULL,
  body          TEXT NOT NULL,
  parent_id     BIGINT REFERENCES article_comments(id) ON DELETE CASCADE,
  is_moderated  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_comments_slug ON article_comments(article_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_article_comments_parent ON article_comments(parent_id);
