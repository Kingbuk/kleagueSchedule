import type { WeatherInfo, WeatherDisplay } from '../types'

const SKY_ICON:  { [k: number]: string } = { 1: '☀️', 3: '⛅', 4: '☁️' }
const PTY_ICON:  { [k: number]: string } = { 1: '🌧️', 2: '🌨️', 3: '❄️', 4: '🌦️' }
const SKY_LABEL: { [k: number]: string } = { 1: '맑음', 3: '구름많음', 4: '흐림' }
const PTY_LABEL: { [k: number]: string } = { 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' }

export function getWeatherDisplay(weather: WeatherInfo | null | undefined): WeatherDisplay | null {
  if (!weather?.available) return null
  const hasPty = (weather.pty ?? 0) > 0
  return {
    icon:  hasPty ? (PTY_ICON[weather.pty!]  ?? '🌦️') : (SKY_ICON[weather.sky!]  ?? '🌤️'),
    label: hasPty ? (PTY_LABEL[weather.pty!] ?? '')    : (SKY_LABEL[weather.sky!] ?? ''),
    temp:     weather.temp,
    humidity: weather.humidity,
  }
}
