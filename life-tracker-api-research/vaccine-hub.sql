\echo 'Delete and recreate database table?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE Person;
CREATE DATABASE Person;
\connect Person;

\i vaccine-hub-schema.sql
