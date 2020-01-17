DROP TABLE IF EXISTS city_explorer;

CREATE TABLE city_explorer (
id SERIAL PRIMARY KEY NOT NULL,
search_query VARCHAR(255) NOT NULL,
formatted_query VARCHAR(100) NOT NULL,
latitude VARCHAR(100) NOT NULL,
longitude VARCHAR(100) NOT NULL
);

INSERT INTO city_explorer (search_query, formatted_query, latitude, longitude) VALUES ('xyz','hello there', '0', '0');
