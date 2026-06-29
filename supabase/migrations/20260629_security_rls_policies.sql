-- ============================================================================
-- Migração de Segurança: Políticas de Row Level Security (RLS) para Supabase
-- Data: 29/06/2026
-- Projeto: Aventuras Fantásticas - Fichas FF
-- Nota de Correção: Todos os campos são convertidos para ::text de ambos os lados
-- para evitar erros de incompatibilidade de tipos (uuid = text) no PostgreSQL.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tabela: adventure_sheets (Fichas de Aventura)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS adventure_sheets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ler suas próprias fichas" ON adventure_sheets;
CREATE POLICY "Usuários podem ler suas próprias fichas"
ON adventure_sheets FOR SELECT
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias fichas" ON adventure_sheets;
CREATE POLICY "Usuários podem criar suas próprias fichas"
ON adventure_sheets FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias fichas" ON adventure_sheets;
CREATE POLICY "Usuários podem atualizar suas próprias fichas"
ON adventure_sheets FOR UPDATE
USING (user_id::text = auth.uid()::text)
WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias fichas" ON adventure_sheets;
CREATE POLICY "Usuários podem deletar suas próprias fichas"
ON adventure_sheets FOR DELETE
USING (user_id::text = auth.uid()::text);

-- ----------------------------------------------------------------------------
-- 2. Tabela: adventure_logs (Logs de Combate e Aventura)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS adventure_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ler logs de suas fichas" ON adventure_logs;
CREATE POLICY "Usuários podem ler logs de suas fichas"
ON adventure_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM adventure_sheets
    WHERE adventure_sheets.id::text = adventure_logs.sheet_id::text
    AND adventure_sheets.user_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "Usuários podem inserir logs em suas fichas" ON adventure_logs;
CREATE POLICY "Usuários podem inserir logs em suas fichas"
ON adventure_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM adventure_sheets
    WHERE adventure_sheets.id::text = adventure_logs.sheet_id::text
    AND adventure_sheets.user_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "Usuários podem deletar logs de suas fichas" ON adventure_logs;
CREATE POLICY "Usuários podem deletar logs de suas fichas"
ON adventure_logs FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM adventure_sheets
    WHERE adventure_sheets.id::text = adventure_logs.sheet_id::text
    AND adventure_sheets.user_id::text = auth.uid()::text
  )
);

-- ----------------------------------------------------------------------------
-- 3. Tabela: user_profiles (Perfis de Usuário)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública/autenticada de perfis" ON user_profiles;
CREATE POLICY "Leitura pública/autenticada de perfis"
ON user_profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Usuários podem gerenciar seu próprio perfil" ON user_profiles;
CREATE POLICY "Usuários podem gerenciar seu próprio perfil"
ON user_profiles FOR ALL
USING (id::text = auth.uid()::text)
WITH CHECK (id::text = auth.uid()::text);

-- ----------------------------------------------------------------------------
-- 4. Tabela: user_stats (Estatísticas de Usuário)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública/autenticada de estatísticas" ON user_stats;
CREATE POLICY "Leitura pública/autenticada de estatísticas"
ON user_stats FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias estatísticas" ON user_stats;
CREATE POLICY "Usuários podem gerenciar suas próprias estatísticas"
ON user_stats FOR ALL
USING (user_id::text = auth.uid()::text)
WITH CHECK (user_id::text = auth.uid()::text);

-- ----------------------------------------------------------------------------
-- 5. Tabela: user_achievements (Conquistas de Usuário)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública/autenticada de conquistas" ON user_achievements;
CREATE POLICY "Leitura pública/autenticada de conquistas"
ON user_achievements FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Usuários podem registrar suas próprias conquistas" ON user_achievements;
CREATE POLICY "Usuários podem registrar suas próprias conquistas"
ON user_achievements FOR ALL
USING (user_id::text = auth.uid()::text)
WITH CHECK (user_id::text = auth.uid()::text);

-- ----------------------------------------------------------------------------
-- 6. Tabela: admin_users (Usuários Administradores)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de status de admin para o próprio usuário" ON admin_users;
CREATE POLICY "Leitura de status de admin para o próprio usuário"
ON admin_users FOR SELECT
USING (id::text = auth.uid()::text);

-- ----------------------------------------------------------------------------
-- 7. Tabela: guild_news (Notícias do Mural)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS guild_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de notícias" ON guild_news;
CREATE POLICY "Leitura pública de notícias"
ON guild_news FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Apenas admins podem modificar notícias" ON guild_news;
CREATE POLICY "Apenas admins podem modificar notícias"
ON guild_news FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id::text = auth.uid()::text
    AND admin_users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id::text = auth.uid()::text
    AND admin_users.is_admin = true
  )
);

-- ----------------------------------------------------------------------------
-- 8. Tabela: youtube_settings (Configurações de Transmissão)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS youtube_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de configurações do YouTube" ON youtube_settings;
CREATE POLICY "Leitura pública de configurações do YouTube"
ON youtube_settings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Apenas admins podem modificar configurações do YouTube" ON youtube_settings;
CREATE POLICY "Apenas admins podem modificar configurações do YouTube"
ON youtube_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id::text = auth.uid()::text
    AND admin_users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id::text = auth.uid()::text
    AND admin_users.is_admin = true
  )
);
