package com.kleague.backend.domain;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchSchedule {
    private Long id;
    private Integer round;
    private LocalDateTime matchDate;
    private Long homeTeamId;
    private Long awayTeamId;
    private Long stadiumId;
    private String status;
    private Integer homeScore;
    private Integer awayScore;

    // JOIN 결과
    private String homeTeamName;
    private String awayTeamName;
    private String homeTeamShortName;
    private String awayTeamShortName;
    private String stadiumName;
    private String stadiumCity;
    private Integer stadiumNx;
    private Integer stadiumNy;

    // 날씨 (서비스 레이어에서 채움, DB 컬럼 아님)
    private WeatherInfo weather;
}
