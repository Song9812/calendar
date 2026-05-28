const SHEET_ID = '1uIKpU3amR6DkFoIaqBCHE6gYV60zHbJXQeyR9tdPiXU'
const API_KEY = 'AIzaSyBojEgk-XtVBWMZVP6jc69CwlI5bOP5-rg'
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

// 일정 목록 가져오기
export async function fetchEvents() {
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet1!A2:F1000?key=${API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.values) return []
  return data.values.map((row, index) => ({
    rowIndex: index + 2, // 실제 시트 행 번호 (1행 = 헤더)
    startDate: row[0] || '',
    endDate: row[1] || '',
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
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet1!A:F:append?valueInputOption=USER_ENTERED&key=${API_KEY}`
  const body = {
    values: [[
      event.startDate,
      event.endDate,
      event.title,
      event.subject,
      'N',
      event.memo,
    ]]
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.ok
}

// 일정 수정
export async function updateEvent(rowIndex, event) {
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet1!A${rowIndex}:F${rowIndex}?valueInputOption=USER_ENTERED&key=${API_KEY}`
  const body = {
    values: [[
      event.startDate,
      event.endDate,
      event.title,
      event.subject,
      event.done,
      event.memo,
    ]]
  }
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.ok
}

// 일정 삭제 (행 내용 지우기)
export async function deleteEvent(rowIndex) {
  const url = `${BASE_URL}/${SHEET_ID}/values/Sheet1!A${rowIndex}:F${rowIndex}:clear?key=${API_KEY}`
  const res = await fetch(url, { method: 'POST' })
  return res.ok
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
