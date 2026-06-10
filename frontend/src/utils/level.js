const TIERS = [
  { min: 0,    max: 99,       lv: 1, en: 'Novice',     ko: '초보 모험가', icon: '🌱' },
  { min: 100,  max: 299,      lv: 2, en: 'Apprentice',  ko: '견습생',      icon: '⚗️' },
  { min: 300,  max: 599,      lv: 3, en: 'Knight',      ko: '기사',        icon: '🗡️' },
  { min: 600,  max: 999,      lv: 4, en: 'Warrior',     ko: '전사',        icon: '⚔️' },
  { min: 1000, max: 1999,     lv: 5, en: 'Hero',        ko: '영웅',        icon: '🏅' },
  { min: 2000, max: 3999,     lv: 6, en: 'Champion',    ko: '챔피언',      icon: '👑' },
  { min: 4000, max: Infinity, lv: 7, en: 'Legend',      ko: '전설',        icon: '⭐' },
]

export function getLevel(points, lang = 'en') {
  const idx = TIERS.findIndex(t => points >= t.min && points <= t.max)
  const tier = TIERS[idx] ?? TIERS[TIERS.length - 1]
  const next = TIERS[idx + 1]
  const progress = next
    ? Math.round(((points - tier.min) / (next.min - tier.min)) * 100)
    : 100
  return {
    level:    tier.lv,
    title:    lang === 'ko' ? tier.ko : tier.en,
    icon:     tier.icon,
    progress: Math.min(100, progress),
    nextXp:   next?.min ?? null,
    xp:       points,
  }
}

const DIFFICULTIES = [
  { max: 9,        en: 'Easy',   ko: '쉬움',   cls: 'text-slate-500 bg-slate-100' },
  { max: 24,       en: 'Normal', ko: '보통',   cls: 'text-emerald-600 bg-emerald-50' },
  { max: 49,       en: 'Hard',   ko: '어려움', cls: 'text-orange-600 bg-orange-50' },
  { max: Infinity, en: 'Epic',   ko: '영웅급', cls: 'text-violet-700 bg-violet-100' },
]

export function getDifficulty(points, lang = 'en') {
  const d = DIFFICULTIES.find(d => points <= d.max)
  return { label: lang === 'ko' ? d.ko : d.en, cls: d.cls }
}
