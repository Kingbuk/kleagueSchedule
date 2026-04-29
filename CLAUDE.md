# K-League 직관 도우미 앱

## 프로젝트 개요
K리그 경기 일정 조회를 시작으로, 경기날 해당 지역 이벤트 및 경기장 교통 안내까지 포함하는 **직관 종합 가이드 웹앱**.

## 기술 스택
- **프론트엔드**: React + Vite + TailwindCSS + TanStack Query
- **백엔드**: Spring Boot 3.5 + MyBatis + PostgreSQL
- **인프라**: Docker Compose (로컬 개발)

## 현재 진행 상황
- [x] Docker Compose로 PostgreSQL 세팅 (`docker-compose.yml`)
- [x] DB 초기화 SQL (`db/init.sql`) — 팀, 경기장, 경기일정 테이블 + K리그1 기본 데이터
- [x] Spring Boot 백엔드 구조 세팅
  - `GET /api/matches` — 전체 일정 조회 (round, teamId 필터 가능)
  - `GET /api/matches/{id}` — 경기 상세
  - `GET /api/teams` — 팀 목록
- [ ] React 프론트엔드 생성 (Node.js 설치 후 진행 예정)

## 데이터 수급 전략
- MVP: DB에 직접 입력
- 이후: 공공데이터포털 API 또는 K리그 공식 사이트 스크래핑으로 자동화

## 로드맵
1. **1단계 (MVP)**: K리그 일정 목록 + 경기 상세 페이지
2. **2단계**: 경기장 위치 + 카카오맵 연동
3. **3단계**: 경기날 지역 이벤트 추천
4. **4단계**: 대중교통 경로 안내 (카카오모빌리티 / T맵 API)
5. **5단계**: 모바일 앱 전환 (React Native + Expo)

## 개발 환경 실행 방법
```bash
# DB 실행
docker compose up -d

# 백엔드 실행
cd backend
./mvnw spring-boot:run

# 프론트 실행 (Node.js 설치 후)
cd frontend
npm run dev
```

## DB 접속 정보 (로컬)
- host: localhost:5432
- database: kleague
- username: kleague
- password: kleague1234

## 개발자 정보
- React, Spring Boot, MyBatis, PostgreSQL/MySQL 경험 보유
- 웹으로 먼저 개발 후 모바일 앱으로 확장 계획

## TODO LIST (추후에 만들예정)
- 라이브스코어 API 연동 후 실시간 경기 상황 볼 수 있게 추가.