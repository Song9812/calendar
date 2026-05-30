const SHEET_ID = '1uIKpU3amR6DkFoIaqBCHE6gYV60zHbJXQeyR9tdPiXU'
const API_KEY = 'AIzaSyBojEgk-XtVBWMZVP6jc69CwlI5bOP5-rg'
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyny0zZuVBBivNWJOyIuQnV1yt0t8rgHiIbATj7GXRrw6PTwjO4D4EONUE_bR-OTgoqKg/exec'

// 날짜 형식 정규화 (2026-6-1 → 2026-06-01)
function normalizeDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// 일정 목록 가져오기
export async function fetchEvents() {
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet1!A2:F1000?key=${API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.values) return []
  return data.values.map((row, index) => ({
    rowIndex: index + 2,
    startDate: normalizeDate(row[0] || ''),
    endDate: normalizeDate(row[1] || ''),
    title: row[2] || '',
    subject: row[3] || '',
    done: row[4] || 'N',
    memo: row[5] || '',
  })).filter(e => e.startDate && e.title)
}

// 주제 목록 가져오기
export async function fetchSubjects() {
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet2!A2:B20?key=${API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.values) return []
  return data.values.map(row => ({
    name: row[0] || '',
    color: row[1] || '',
  })).filter(s => s.name)
}

// 일정 추가
export async function addEvent(event) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'add', ...event }),
  })
}

// 일정 수정
export async function updateEvent(rowIndex, event) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'update', rowIndex, ...event }),
  })
}

// 일정 삭제
export async function deleteEvent(rowIndex) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', rowIndex }),
  })
}

// 색상 이름 → CSS 색상값 변환
export function colorNameToHex(colorName) {
  const map = {
    '하늘색': '#7DD3FC',
    '연두색': '#86EFAC',
    '노랑': '#FDE68A',
    '파랑': '#93C5FD',
    '초록': '#6EE7B7',
    '주황': '#FCA5A5',
    '빨강': '#F87171',
    '보라': '#C4B5FD',
    '분홍': '#F9A8D4',
  }
  return map[colorName] || '#E5E7EB'
}

export function colorNameToBg(colorName) {
  const map = {
    '하늘색': '#E0F2FE',
    '연두색': '#DCFCE7',
    '노랑': '#FEF9C3',
    '파랑': '#DBEAFE',
    '초록': '#D1FAE5',
    '주황': '#FFEDD5',
    '빨강': '#FEE2E2',
    '보라': '#EDE9FE',
    '분홍': '#FCE7F3',
  }
  return map[colorName] || '#F3F4F6'
}
