package com.kleague.backend.mapper;

import com.kleague.backend.domain.Team;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TeamMapper {
    List<Team> findAll();
}
