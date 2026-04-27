import axios from 'axios'
import type { Match, Team } from './types'

const api = axios.create({ baseURL: '/api' })

export const fetchMatches = (params?: Record<string, unknown>): Promise<Match[]> =>
  api.get('/matches', { params }).then((r) => r.data)

export const fetchMatch = (id: number): Promise<Match> =>
  api.get(`/matches/${id}`).then((r) => r.data)

export const fetchTeams = (): Promise<Team[]> =>
  api.get('/teams').then((r) => r.data)
