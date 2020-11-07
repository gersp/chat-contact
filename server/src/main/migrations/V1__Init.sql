CREATE TABLE users
(
    id                BIGINT                   NOT NULL PRIMARY KEY,
    display_name      TEXT                     NOT NULL,

    image_link        TEXT                     ,
    interests_text      TEXT                   NOT NULL
);

CREATE SEQUENCE user_id_seq
    START 1;
