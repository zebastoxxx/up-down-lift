-- Reset admin password to plaintext for testing
UPDATE users 
SET password_hash = 'admin123'
WHERE username = 'admin';

-- Ensure usernames are properly cased
UPDATE users 
SET username = LOWER(username)
WHERE username = 'admin';

UPDATE users 
SET username = LOWER(username)
WHERE username = 'Gerencia';