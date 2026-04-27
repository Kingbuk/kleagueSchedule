-- 팀 테이블
CREATE TABLE team (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    short_name    VARCHAR(20),
    logo_url      VARCHAR(255),
    city          VARCHAR(50),
    stadium       VARCHAR(100),
    primary_color VARCHAR(7)
);

-- 경기장 테이블
CREATE TABLE stadium (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    city        VARCHAR(50),
    address     VARCHAR(255),
    latitude    DECIMAL(10, 7),
    longitude   DECIMAL(10, 7),
    capacity    INTEGER
);

-- 경기 일정 테이블
CREATE TABLE match_schedule (
    id              SERIAL PRIMARY KEY,
    round           INTEGER,
    match_date      TIMESTAMP NOT NULL,
    home_team_id    INTEGER REFERENCES team(id),
    away_team_id    INTEGER REFERENCES team(id),
    stadium_id      INTEGER REFERENCES stadium(id),
    status          VARCHAR(20) DEFAULT 'SCHEDULED',  -- SCHEDULED, LIVE, FINISHED
    home_score      INTEGER,
    away_score      INTEGER
);

-- K리그1 팀 기본 데이터
INSERT INTO team (name, short_name, city, stadium, primary_color) VALUES
('전북 현대 모터스', '전북현대', '전주', '전주월드컵경기장',             '#1A6330'),
('울산 HD',          '울산HD',   '울산', '울산문수축구경기장',            '#174C9A'),
('FC 서울',          'FC서울',   '서울', '서울월드컵경기장',              '#C8102E'),
('수원 삼성 블루윙즈','수원삼성', '수원', '수원월드컵경기장',             '#0038A8'),
('포항 스틸러스',    '포항',     '포항', '포항스틸야드',                  '#EE1C25'),
('대구 FC',          '대구FC',   '대구', 'DGB대구은행파크',               '#5C069C'),
('제주 유나이티드',  '제주',     '제주', '제주월드컵경기장',              '#EE7600'),
('인천 유나이티드',  '인천',     '인천', '인천축구전용경기장',            '#0030A0'),
('강원 FC',          '강원FC',   '강릉', '강릉종합운동장',                '#15284B'),
('광주 FC',          '광주FC',   '광주', '광주축구전용구장',              '#F5C500'),
('성남 FC',          '성남FC',   '성남', '탄천종합운동장',                '#1B1B1B'),
('김천 상무',        '김천상무', '김천', '김천종합스포츠타운주경기장',    '#00529B');

-- 경기장 기본 데이터 (nx, ny: 기상청 격자 좌표)
INSERT INTO stadium (name, city, address, latitude, longitude, capacity, nx, ny) VALUES
('전주월드컵경기장', '전주', '전북 전주시 덕진구 기린대로 1065', 35.8197, 127.1302, 42477, 63,  89),
('울산문수축구경기장', '울산', '울산 남구 문수로 44',              35.5397, 129.2869, 44102, 102, 84),
('서울월드컵경기장', '서울', '서울 마포구 월드컵로 240',           37.5683, 126.8972, 66806, 58,  126),
('포항스틸야드', '포항', '경북 포항시 북구 흥해읍 초곡길 8',      36.0988, 129.3878, 17443, 107, 100);

-- 경기 일정 샘플 데이터 (2025 K리그1)
-- team id: 1=전북, 2=울산, 3=서울, 4=수원, 5=포항, 6=대구, 7=제주, 8=인천, 9=강원, 10=광주, 11=성남, 12=김천
-- stadium id: 1=전주, 2=울산, 3=서울, 4=포항
INSERT INTO match_schedule (round, match_date, home_team_id, away_team_id, stadium_id, status, home_score, away_score) VALUES
(1, '2025-03-01 14:00:00', 3, 2, 3, 'FINISHED', 1, 2),
(1, '2025-03-01 16:00:00', 1, 5, 1, 'FINISHED', 3, 1),
(1, '2025-03-02 14:00:00', 6, 8, NULL, 'FINISHED', 0, 0),
(1, '2025-03-02 16:00:00', 7, 9, NULL, 'FINISHED', 2, 1),
(2, '2025-03-08 14:00:00', 2, 1, 2, 'FINISHED', 1, 1),
(2, '2025-03-08 16:00:00', 5, 3, 4, 'FINISHED', 2, 0),
(2, '2025-03-09 14:00:00', 8, 6, NULL, 'FINISHED', 1, 0),
(2, '2025-03-09 16:00:00', 9, 7, NULL, 'FINISHED', 0, 2),
(3, '2025-03-15 14:00:00', 1, 3, 1, 'FINISHED', 2, 2),
(3, '2025-03-15 16:00:00', 2, 5, 2, 'FINISHED', 3, 0),
(4, '2025-03-22 14:00:00', 3, 1, 3, 'SCHEDULED', NULL, NULL),
(4, '2025-03-22 16:00:00', 5, 2, 4, 'SCHEDULED', NULL, NULL),
(4, '2025-03-23 14:00:00', 6, 7, NULL, 'SCHEDULED', NULL, NULL),
(4, '2025-03-23 16:00:00', 10, 11, NULL, 'SCHEDULED', NULL, NULL),
(5, '2025-03-29 14:00:00', 1, 2, 1, 'SCHEDULED', NULL, NULL),
(5, '2025-03-29 16:00:00', 3, 5, 3, 'SCHEDULED', NULL, NULL);
