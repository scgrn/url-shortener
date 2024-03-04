CREATE DATABASE url_shortener;

USE url_shortener;

CREATE TABLE IF NOT EXISTS urls (
    id int(11) NOT NULL AUTO_INCREMENT,
    targetURL VARCHAR(2048) CHARACTER SET 'ascii' COLLATE 'ascii_general_ci' NOT NULL,
    shortCode VARCHAR(50) CHARACTER SET 'ascii' COLLATE 'ascii_general_ci' NOT NULL,
    dateCreated date NOT NULL,
    dateLastHit date,
    hits INT DEFAULT 0,
    
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

