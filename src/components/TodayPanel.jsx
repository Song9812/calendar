import { colorNameToHex, colorNameToBg } from '../utils/sheets'

export default function TodayPanel({ events, subjects, onToggleDone }) {
  const today = new Date().toISOString().slice(0, 10)

  const todayEvents = events.filter(e => {
    const end = e.endDate || e.startDate
    return today >= e.startDate && today <= end
  })

  const grouped = subjects.reduce((acc, s) => {
    const filtered = todayEvents.filter(e => e.subject === s.name)
    if (filtered.length > 0) acc[s.name] = { events: filtered, color: s.color }
    return acc
  }, {})

  const others = todayEvents.filter(e => !subjects.find(s => s.name === e.subject))
  if (others.length > 0) grouped['기타'] = { events: others, color: '' }

  const total = todayEvents.length
  const done = todayEvents.filter(e => e.done === 'Y').length

  const formatToday = () => {
    const d = new Date()
    return `${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <div className="today-panel">
      <div className="today-header">
        <span className="today-title">📋 오늘 일정</span>
        <span className="today-date">{formatToday()}</span>
      </div>

      {total > 0 && (
        <div className="today-progress">
          <div className="today-progress-bar">
            <div
              className="today-progress-fill"
              style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
            />
          </div>
          <span className="today-progress-text">{done}/{total} 완료</span>
        </div>
      )}

      {total === 0 ? (
        <p className="today-empty">오늘 일정이 없습니다.</p>
      ) : (
        Object.entries(grouped).map(([subjectName, { events: evts, color }]) => (
          <div key={subjectName} className="today-group">
            <div
              className="today-group-label"
              style={{
                background: colorNameToBg(color),
                borderLeft: `3px solid ${colorNameToHex(color)}`
              }}
            >
              {subjectName}
            </div>
            {evts.map(e => (
              <div
                key={e.rowIndex}
                className={`today-event ${e.done === 'Y' ? 'done' : ''}`}
                onClick={() => onToggleDone(e)}
              >
                <span className="today-checkbox">
                  {e.done === 'Y' ? '☑' : '☐'}
                </span>
                <span className="today-event-title">{e.title}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
