package com.kleague.backend.domain;

import lombok.Data;

@Data
public class Team {
    private Long id;
    private String name;
    private String shortName;
    private String logoUrl;
    private String city;
    private String stadium;
    private String primaryColor;
}
