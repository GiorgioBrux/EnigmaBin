-- Enable the extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_pastes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Paste"
  WHERE "expiresAt" < NOW();
END;
$$;

-- Schedule the job to run every minute
SELECT cron.schedule(
  'cleanup-expired-pastes',    -- unique job name
  '* * * * *',                -- every minute
  'SELECT cleanup_expired_pastes()'
);