import { useState } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { colorNameToHex, colorNameToBg } from '../utils/sheets'

dayjs.extend(isBetween)

export default function Calendar({ events, subjects, onDayClick }) {
  const [current, setCurrent] = useState(dayjs())

  const startOfMonth = current.startOf('month')
  const endOfMonth = current.endOf('month')
  const startDay = startOfMonth.day()
  const daysInMonth = endOfMonth.date()
  const today = dayjs().format('YYYY-MM-DD')

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

  // 이전달 마지막 날들
  const prevMonthEnd = startOfMonth.subtract(1, 'day')
  const prefixDays = []
  for (let i = startDay - 1; i >= 0; i--) {
    prefixDays.push(prevMonthEnd.subtract(i, 'day'))
  }

  // 이번달 날들
  const currentDays = []
  for (let d = 1; d <= daysInMonth; d++) {
    currentDays.push(current.date(d))
  }

  // 다음달 앞 날들 (6주 채우기)
  const totalCells = prefixDays.length + currentDays.length
  const suffixCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const suffixDays = []
  for (let i = 1; i <= suffixCount; i++) {
    suffixDays.push(endOfMonth.add(i, 'day'))
  }

  const allDays = [
    ...prefixDays.map(d => ({ day: d, isCurrentMonth: false })),
    ...currentDays.map(d => ({ day: d, isCurrentMonth: true })),
    ...suffixDays.map(d => ({ day: d, isCurrentMonth: false })),
  ]

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

      <div className="cal-legend">
        {subjects.map(s => (
          <span
            key={s.name}
            className="legend-item"
            style={{
              background: colorNameToBg(s.color),
              border: `1px solid ${colorNameToHex(s.color)}`
            }}
          >
            {s.name}
          </span>
        ))}
      </div>

      <div className="cal-grid">
        {weeks.map((w, i) => (
          <div key={w} className={`cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{w}</div>
        ))}
        {allDays.map(({ day, isCurrentMonth }) => {
          const dateStr = day.format('YYYY-MM-DD')
          const dayEvents = getEventsForDate(dateStr)
          const isToday = dateStr === today
          const col = day.day()
          const isSun = col === 0
          const isSat = col === 6

          return (
            <div
              key={dateStr}
              className={[
                'cal-cell',
                isToday ? 'today' : '',
                !isCurrentMonth ? 'other-month' : '',
                isSun ? 'sun' : '',
                isSat ? 'sat' : '',
              ].join(' ')}
              onClick={() => onDayClick(dateStr, dayEvents)}
            >
              <span className="cal-day-num">{day.date()}</span>
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
