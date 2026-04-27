package com.kleague.backend.controller;

import com.kleague.backend.domain.MatchSchedule;
import com.kleague.backend.service.MatchScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MatchScheduleController {

    private final MatchScheduleService matchScheduleService;

    @GetMapping
    public List<MatchSchedule> getAll(
            @RequestParam(required = false) Integer round,
            @RequestParam(required = false) Long teamId
    ) {
        if (round != null) return matchScheduleService.getByRound(round);
        if (teamId != null) return matchScheduleService.getByTeam(teamId);
        return matchScheduleService.getAll();
    }

    @GetMapping("/{id}")
    public MatchSchedule getById(@PathVariable Long id) {
        return matchScheduleService.getById(id);
    }
}
