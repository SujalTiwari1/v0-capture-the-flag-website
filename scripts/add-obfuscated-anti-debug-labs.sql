-- Add "Go to Lab" for Obfuscated Code and Anti-Debug Technique challenges.
-- Run this in Supabase SQL Editor if you already have challenges seeded.

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'obfuscated-code', 'reverse', true
FROM challenges WHERE title = 'Obfuscated Code'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'anti-debug-technique', 'reverse', true
FROM challenges WHERE title = 'Anti-Debug Technique'
ON CONFLICT (slug) DO NOTHING;
