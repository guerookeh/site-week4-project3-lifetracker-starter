\echo 'Delete and recreate Database table?'
\prompt '(Y/Ctrl-C >)' answer

DROP DATABASE LifeTrackerDB;
CREATE DATABASE LifeTrackerDB;
\connect LifeTrackerDB;

\i user-schema.sql
