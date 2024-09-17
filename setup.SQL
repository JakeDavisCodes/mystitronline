CREATE DATABASE IF NOT EXISTS mystitronline;
USE mystitronline;

CREATE TABLE IF NOT EXISTS users(
  ID int auto_increment not null,
  username varchar(30) not null,
  pass_hash varchar(255) not null,
  phone int not null,
  created_at timestamp default current_timestamp,
  last_pack timestamp default 0,

  primary key(ID)
);

CREATE TABLE IF NOT EXISTS cardSets(
  ID int auto_increment not null,
  complete boolean default false,

  primary key(ID)
);

CREATE TABLE IF NOT EXISTS cards(
  ID int auto_increment not null,
  userId int default null,
  setId int not null,
  title varchar(50) not null,
  num int not null,
  rarity varchar(1) not null,

  primary key(ID),
  foreign key(userId) references users(ID),
  foreign key(setId) references cardSets(ID)
);

CREATE TABLE IF NOT EXISTS offers(
  ID int auto_increment not null,
  userA_id int not null,
  userB_id int not null,
  cardA_id int not null,
  cardB_id int not null,

  primary key(ID),
  foreign key(userA_id) references users(ID),
  foreign key(userB_id) references users(ID),
  foreign key(cardA_id) references cards(ID),
  foreign key(cardB_id) references cards(ID)
);