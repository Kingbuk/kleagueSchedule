package com.kleague.backend.service;

import com.kleague.backend.domain.MatchSchedule;
import com.kleague.backend.mapper.MatchScheduleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchScheduleService {

    private final MatchScheduleMapper matchScheduleMapper;

    public List<MatchSchedule> getAll() {
        return matchScheduleMapper.findAll();
    }

    public List<MatchSchedule> getByRound(Integer round) {
        return matchScheduleMapper.findByRound(round);
    }

    public List<MatchSchedule> getByTeam(Long teamId) {
        return matchScheduleMapper.findByTeamId(teamId);
    }

    public MatchSchedule getById(Long id) {
        return matchScheduleMapper.findById(id);
    }
}
