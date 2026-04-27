package com.kleague.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherInfo {
    private Integer temp;      // TMP: 기온 (°C)
    private Integer sky;       // SKY: 1=맑음, 3=구름많음, 4=흐림
    private Integer pty;       // PTY: 0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기
    private Integer pop;       // POP: 강수확률 (%)
    private Integer humidity;  // REH: 습도 (%)
    private boolean available;
}
