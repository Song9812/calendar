import { colorNameToHex, colorNameToBg } from '../utils/sheets'

export default function DayPopup({ date, events, subjects, onEdit, onDelete, onClose }) {
  const subjectColor = (subjectName) => {
    const found = subjects.find(s => s.name === subjectName)
    return found ? found.color : ''
  }

  // 주제별로 그룹핑
  const grouped = subjects.reduce((acc, s) => {
    const filtered = events.filter(e => e.subject === s.name)
    if (filtered.length > 0) acc[s.name] = { events: filtered, color: s.color }
    return acc
  }, {})

  // 주제 없는 기타 일정
  const others = events.filter(e => !subjects.find(s => s.name === e.subject))
  if (others.length > 0) grouped['기타'] = { events: others, color: '' }

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-')
    return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="day-popup" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <span className="popup-date">{formatDate(date)}</span>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <p className="popup-empty">이 날 일정이 없습니다.</p>
        ) : (
          Object.entries(grouped).map(([subjectName, { events: evts, color }]) => (
            <div key={subjectName} className="popup-group">
              <div
                className="popup-group-label"
                style={{
                  background: colorNameToBg(color),
                  borderLeft: `3px solid ${colorNameToHex(color)}`
                }}
              >
                {subjectName}
              </div>
              {evts.map(event => (
                <div key={event.rowIndex} className="popup-event">
                  <div className="popup-event-info">
                    <span className="popup-event-title">{event.title}</span>
                    {event.endDate && event.endDate !== event.startDate && (
                      <span className="popup-event-range">~ {event.endDate}</span>
                    )}
                    {event.memo && <span className="popup-event-memo">{event.memo}</span>}
                  </div>
                  <div className="popup-event-actions">
                    <button className="btn-edit" onClick={() => onEdit(event)}>수정</button>
                    <button className="btn-delete" onClick={() => onDelete(event)}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
