CREATE USER 'mystique'@localhost IDENTIFIED BY 'mystic1';

GRANT ALL PRIVILEGES ON mystitronline.* to 'mystique'@localhost;

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'mystique'@localhost;

!! CHANGE 'mystique' FOR CORRECT USERNAME             !!
!! DO NOT USE 'mystic1' AS THE PASSWORD               !!
!! HOST WILL NOT BE @localhost ON SERVER APPLICATIONS !!