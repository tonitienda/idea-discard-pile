DROP INDEX IF EXISTS notifications_building_once;
DELETE FROM notifications WHERE type = 'building';
ALTER TABLE ideas DROP COLUMN IF EXISTS building_url;
ALTER TABLE ideas DROP COLUMN IF EXISTS building_since;
