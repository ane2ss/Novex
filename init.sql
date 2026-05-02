CREATE USER authuser WITH PASSWORD 'authpass123';
CREATE DATABASE authdb OWNER authuser;

CREATE USER projectuser WITH PASSWORD 'projectpass123';
CREATE DATABASE projectdb OWNER projectuser;

CREATE USER interactionuser WITH PASSWORD 'interactionpass123';
CREATE DATABASE interactiondb OWNER interactionuser;

CREATE USER notificationuser WITH PASSWORD 'notificationpass123';
CREATE DATABASE notificationdb OWNER notificationuser;
