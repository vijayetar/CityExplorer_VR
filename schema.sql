DROP TABLE IF EXISTS city_explorer;
CREATE TABLE city_explorer (
id SERIAL PRIMARY KEY NOT NULL,
location VARCHAR(255) NOT NULL,
latitude VARCHAR(100) NOT NULL,
longitude VARCHAR(100) NOT NULL
);

INSERT INTO city_explorer (location, latitude, longitude) VALUES ('Seattle','hello there', 'hello there');