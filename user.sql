CREATE USER 'mystique'@localhost IDENTIFIED BY 'mystic1';

GRANT ALL PRIVILEGES ON mystitronline.* to 'mystique'@localhost;

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'mystique'@localhost;