package com.kleague.backend.controller;

import com.kleague.backend.domain.Team;
import com.kleague.backend.mapper.TeamMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamMapper teamMapper;

    @GetMapping
    public List<Team> getAll() {
        return teamMapper.findAll();
    }
}
