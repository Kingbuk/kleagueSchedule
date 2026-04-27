export interface WeatherInfo {
  temp: number | null
  sky: number | null
  pty: number | null
  pop: number | null
  humidity: number | null
  available: boolean
}

export interface WeatherDisplay {
  icon: string
  label: string
  temp: number | null
  humidity: number | null
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED'

export interface Match {
  id: number
  round: number
  matchDate: string
  homeTeamId: number
  awayTeamId: number
  stadiumId: number | null
  status: MatchStatus
  homeScore: number | null
  awayScore: number | null
  homeTeamName: string
  awayTeamName: string
  homeTeamShortName: string
  awayTeamShortName: string
  stadiumName: string | null
  stadiumCity: string | null
  stadiumNx: number | null
  stadiumNy: number | null
  weather: WeatherInfo | null
}

export interface Team {
  id: number
  name: string
  shortName: string
  logoUrl: string | null
  city: string
  stadium: string
  primaryColor: string | null
}

export type TabKey = 'my-team' | 'all'
