-- One-time cleanup of the former anonymous poll.
-- All historical guest poll responses will be permanently erased.
-- This does NOT change email-verified poll responses or guest game scores/progress.
-- Back up the database before applying to production.
BEGIN;
DROP TABLE IF EXISTS community_poll_guest;
COMMIT;
