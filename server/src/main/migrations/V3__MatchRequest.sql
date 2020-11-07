CREATE TABLE match_requests
(
    id                  BIGINT                  NOT NULL PRIMARY KEY,
    user_id             BIGINT                  NOT NULL,
    topic_text          TEXT                    NOT NULL,

    morning             BOOL                    NOT NULL DEFAULT FALSE,
    daytime             BOOL                    NOT NULL DEFAULT FALSE,
    evening             BOOL                    NOT NULL DEFAULT FALSE,
    night               BOOL                    NOT NULL DEFAULT FALSE,
    weekends            BOOL                    NOT NULL DEFAULT FALSE,

    timestamp           TIMESTAMP               NOT NULL DEFAULT now(),

    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE SEQUENCE match_request_id_seq START 1;


CREATE TABLE match_status
(
    id                          BIGINT                  NOT NULL PRIMARY KEY,
    first_user_id               BIGINT                  NOT NULL,
    second_user_id              BIGINT                  NOT NULL,
    first_match_request_id      BIGINT                  NOT NULL,
    second_match_request_id     BIGINT                  NOT NULL,

    status              TEXT                    NOT NULL,

    timestamp           TIMESTAMP               NOT NULL DEFAULT now(),

    FOREIGN KEY(first_user_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(second_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(first_match_request_id)  REFERENCES match_requests(id) ON DELETE CASCADE,
    FOREIGN KEY(second_match_request_id) REFERENCES match_requests(id) ON DELETE CASCADE
);

CREATE SEQUENCE match_status_id_seq START 1;
