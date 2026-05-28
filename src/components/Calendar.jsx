import { useState } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { colorNameToHex, colorNameToBg } from '../utils/sheets'

dayjs.extend(isBetween)

export default function Calendar({ events, subjects, onDayClick }) {
  const [current, setCurrent] = useState(dayjs())

  const startOfMonth = current.startOf('month')
  const endOfMonth = current.endOf('month')
  const startDay = startOfMonth.day() // 0=일
  const daysInMonth = endOfMonth.date()
  const today = dayjs().format('YYYY-MM-DD')

  // 해당 날짜에 걸쳐있는 일정 반환
  const getEventsForDate = (dateStr) => {
    return events.filter(e => {
      const start = e.startDate
      const end = e.endDate || e.startDate
      return dateStr >= start && dateStr <= end
    })
  }

  const subjectColor = (subjectName) => {
    const found = subjects.find(s => s.name === subjectName)
    return found ? found.color : ''
  }

  const prevMonth = () => setCurrent(prev => prev.subtract(1, 'month'))
  const nextMonth = () => setCurrent(prev => prev.add(1, 'month'))
  const goToday = () => setCurrent(dayjs())

  const weeks = ['일', '월', '화', '수', '목', '금', '토']

  // 달력 셀 배열 만들기
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <div className="cal-title">
          <span className="cal-year">{current.year()}</span>
          <span className="cal-month">{current.month() + 1}월</span>
        </div>
        <button className="cal-nav" onClick={nextMonth}>›</button>
        <button className="cal-today" onClick={goToday}>오늘</button>
      </div>

      {/* 주제 범례 */}
      <div className="cal-legend">
        {subjects.map(s => (
          <span key={s.name} className="legend-item" style={{ background: colorNameToBg(s.color), border: `1px solid ${colorNameToHex(s.color)}` }}>
            {s.name}
          </span>
        ))}
      </div>

      <div className="cal-grid">
        {weeks.map((w, i) => (
          <div key={w} className={`cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{w}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="cal-cell empty" />
          const dateStr = current.date(day).format('YYYY-MM-DD')
          const dayEvents = getEventsForDate(dateStr)
          const isToday = dateStr === today
          const isSun = (idx % 7 === 0)
          const isSat = (idx % 7 === 6)

          return (
            <div
              key={dateStr}
              className={`cal-cell ${isToday ? 'today' : ''} ${isSun ? 'sun' : ''} ${isSat ? 'sat' : ''}`}
              onClick={() => onDayClick(dateStr, dayEvents)}
            >
              <span className="cal-day-num">{day}</span>
              <div className="cal-events">
                {dayEvents.slice(0, 3).map(e => {
                  const color = subjectColor(e.subject)
                  return (
                    <div
                      key={e.rowIndex}
                      className="cal-event-chip"
                      style={{
                        background: colorNameToBg(color),
                        borderLeft: `2px solid ${colorNameToHex(color)}`
                      }}
                    >
                      {e.title}
                    </div>
                  )
                })}
                {dayEvents.length > 3 && (
                  <div className="cal-event-more">+{dayEvents.length - 3}개</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
