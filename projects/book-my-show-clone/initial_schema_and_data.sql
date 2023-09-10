-- Table Theatre
CREATE TABLE Theatre (
    theatre_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (theatre_id)
);

-- Table Movie
CREATE TABLE Movie (
    movie_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    -- in minutes
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (movie_id)
);

-- Table MovieTheatre
CREATE TABLE MovieTheatre (
    movie_id INT NOT NULL,
    theatre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (movie_id, theatre_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
    FOREIGN KEY (theatre_id) REFERENCES Theatre(theatre_id)
);

-- Table Screen
CREATE TABLE Screen (
    screen_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    theatre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (screen_id),
    FOREIGN KEY (theatre_id) REFERENCES Theatre(theatre_id)
);

-- Table MovieScreening
CREATE TABLE MovieScreening (
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    custom_repeat VARCHAR(100) NULL,
    -- A custom repeat which will likely be using the RRULE format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (movie_id, screen_id, start_time),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
    FOREIGN KEY (screen_id) REFERENCES Screen(screen_id)
);

-- Initial Data
START TRANSACTION;

INSERT INTO
    Theatre (name, address, city, state, pincode)
VALUES
    (
        'PVR',
        'Phoenix Market City, Whitefield Road, Mahadevpura, Bengaluru, Karnataka 560048',
        'Bengaluru',
        'Karnataka',
        560048
    );

INSERT INTO
    Movie (name, language, duration, release_date)
VALUES
    (
        'Avengers: Endgame',
        'English',
        181,
        '2019-04-26'
    );

INSERT INTO
    MovieTheatre (movie_id, theatre_id)
VALUES
    (1, 1);

INSERT INTO
    Screen (name, theatre_id)
VALUES
    ('Screen 1', 1);

INSERT INTO
    MovieScreening (
        movie_id,
        screen_id,
        start_time,
        end_time,
        custom_repeat
    )
VALUES
    (
        1,
        1,
        '10:00:00',
        '13:00:00',
        'RRULE:FREQ=DAILY;INTERVAL=1;COUNT=1'
    );

COMMIT;

--Write a query to list down all the shows on a given date at a given theatre along with their respective show timings. 
SELECT
    Movie.name AS movie_name,
    Movie.language AS movie_language,
    Movie.duration AS movie_duration,
    Movie.release_date AS movie_release_date,
    MovieScreening.start_time AS movie_screening_start_time,
    MovieScreening.end_time AS movie_screening_end_time
FROM
    Movie
    INNER JOIN MovieScreening ON Movie.movie_id = MovieScreening.movie_id
WHERE
    MovieScreening.start_time >= $ 1
    AND MovieScreening.start_time <= $ 2
    AND MovieScreening.screen_id IN (
        SELECT
            Screen.screen_id
        FROM
            Screen
        WHERE
            Screen.theatre_id = $ 3
    );