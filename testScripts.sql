/* Test User */
INSERT INTO users (username, phone, pass_hash) VALUES ('y', 'y', 'y');

/* Reset Pack Cooldown */
UPDATE users SET last_pack = 0 WHERE ID = 1;

/* Claim Set 1 */
UPDATE cards SET userId = 1 WHERE ID = 1;
UPDATE cards SET userId = 1 WHERE ID = 2;
UPDATE cards SET userId = 1 WHERE ID = 4;
UPDATE cards SET userId = 1 WHERE ID = 6;
UPDATE cards SET userId = 1 WHERE ID = 8;
UPDATE cards SET userId = 1 WHERE ID = 10;
UPDATE cards SET userId = 1 WHERE ID = 12;
UPDATE cards SET userId = 1 WHERE ID = 15;
UPDATE cards SET userId = 1 WHERE ID = 18;