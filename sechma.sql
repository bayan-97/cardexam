DROP TABLE IF  EXISTS  cards;
CREATE TABLE IF NOT EXISTS cards(
    id  SERIAL PRIMARY KEY,
    country VARCHAR(255),
    confirmed_cases VARCHAR(255),
    death_cases VARCHAR(255),
    Rrecoverd_cases VARCHAR(255),
    date DATE
);
