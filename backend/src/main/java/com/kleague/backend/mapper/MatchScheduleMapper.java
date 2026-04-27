package com.kleague.backend.mapper;

import com.kleague.backend.domain.MatchSchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MatchScheduleMapper {
    List<MatchSchedule> findAll();
    List<MatchSchedule> findByRound(@Param("round") Integer round);
    List<MatchSchedule> findByTeamId(@Param("teamId") Long teamId);
    MatchSchedule findById(@Param("id") Long id);
}
