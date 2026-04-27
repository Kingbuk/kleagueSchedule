package com.kleague.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kleague.backend.domain.WeatherInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class WeatherService {

    private static final String API_URL =
            "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    private static final int[] BASE_TIMES = {2, 5, 8, 11, 14, 17, 20, 23};
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Value("${kma.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 캐시: "nx_ny_baseDate_baseTime" → Map<"fcstDate_fcstTime" → Map<category, value>>
    private final Map<String, Map<String, Map<String, String>>> cache = new ConcurrentHashMap<>();

    public WeatherInfo getWeather(LocalDateTime matchDateTime, Integer nx, Integer ny) {
        if (nx == null || ny == null || matchDateTime == null) {
            return unavailable();
        }

        LocalDateTime now = LocalDateTime.now();
        // 단기예보는 현재 기준 최대 3일 이후까지만 제공
        if (matchDateTime.isBefore(now.minusHours(2)) || matchDateTime.isAfter(now.plusDays(3))) {
            return unavailable();
        }

        try {
            String[] baseDateTime = calcBaseDateTime(now);
            String cacheKey = nx + "_" + ny + "_" + baseDateTime[0] + "_" + baseDateTime[1];

            Map<String, Map<String, String>> forecast = cache.computeIfAbsent(
                    cacheKey, k -> fetchForecast(baseDateTime[0], baseDateTime[1], nx, ny));

            if (forecast == null) return unavailable();

            String fcstKey = matchDateTime.format(DATE_FMT)
                    + "_" + String.format("%02d00", matchDateTime.getHour());
            Map<String, String> categories = forecast.get(fcstKey);
            if (categories == null) return unavailable();

            return WeatherInfo.builder()
                    .temp(parseIntOrNull(categories.get("TMP")))
                    .sky(parseIntOrNull(categories.get("SKY")))
                    .pty(parseIntOrNull(categories.get("PTY")))
                    .pop(parseIntOrNull(categories.get("POP")))
                    .humidity(parseIntOrNull(categories.get("REH")))
                    .available(true)
                    .build();

        } catch (Exception e) {
            log.error("날씨 조회 실패 (nx={}, ny={}, time={}): {}", nx, ny, matchDateTime, e.getMessage());
            return unavailable();
        }
    }

    private Map<String, Map<String, String>> fetchForecast(String baseDate, String baseTime, int nx, int ny) {
        try {
            // apiKey는 .env에 이미 URL 인코딩된 값으로 저장되어 있음 — URI.create()로 그대로 사용
            String rawUrl = String.format(
                    "%s?serviceKey=%s&pageNo=1&numOfRows=1000&dataType=JSON&base_date=%s&base_time=%s&nx=%d&ny=%d",
                    API_URL, apiKey, baseDate, baseTime, nx, ny);

            String response = restTemplate.getForObject(URI.create(rawUrl), String.class);
            return parseForecast(response);

        } catch (Exception e) {
            log.error("기상청 API 호출 실패: {}", e.getMessage());
            return null;
        }
    }

    private Map<String, Map<String, String>> parseForecast(String json) throws Exception {
        JsonNode root = objectMapper.readTree(json);
        JsonNode items = root.path("response").path("body").path("items").path("item");

        Map<String, Map<String, String>> result = new HashMap<>();
        for (JsonNode item : items) {
            String fcstDate = item.path("fcstDate").asText();
            String fcstTime = item.path("fcstTime").asText();
            String category = item.path("category").asText();
            String value = item.path("fcstValue").asText();

            String key = fcstDate + "_" + fcstTime;
            result.computeIfAbsent(key, k -> new HashMap<>()).put(category, value);
        }
        return result;
    }

    // 가장 최근 기상청 발표 시각 계산 (02, 05, 08, 11, 14, 17, 20, 23시)
    private String[] calcBaseDateTime(LocalDateTime now) {
        // 발표 후 약 10분이 지나야 데이터 사용 가능
        LocalDateTime adjusted = now.getMinute() < 10 ? now.minusHours(1) : now;
        int hour = adjusted.getHour();

        int baseHour = -1;
        for (int t : BASE_TIMES) {
            if (t <= hour) baseHour = t;
        }

        if (baseHour == -1) {
            // 당일 02시 이전이면 전날 23시 기준
            LocalDateTime prev = adjusted.minusDays(1);
            return new String[]{prev.format(DATE_FMT), "2300"};
        }
        return new String[]{adjusted.format(DATE_FMT), String.format("%02d00", baseHour)};
    }

    private Integer parseIntOrNull(String value) {
        if (value == null) return null;
        try {
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private WeatherInfo unavailable() {
        return WeatherInfo.builder().available(false).build();
    }
}
