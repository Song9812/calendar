import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import InputForm from './components/InputForm'
import DayPopup from './components/DayPopup'
import { fetchEvents, fetchSubjects, addEvent, updateEvent, deleteEvent } from './utils/sheets'

export default function App() {
  const [events, setEvents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [popup, setPopup] = useState(null) // { date, events }
  const [editingEvent, setEditingEvent] = useState(null)

  const load = async () => {
    setLoading(true)
    const [evts, subs] = await Promise.all([fetchEvents(), fetchSubjects()])
    setEvents(evts)
    setSubjects(subs)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDayClick = (dateStr, dayEvents) => {
    setPopup({ date: dateStr, events: dayEvents })
  }

  const handleAdd = async (form) => {
    await addEvent(form)
    await load()
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setPopup(null)
  }

  const handleUpdate = async (event) => {
    await updateEvent(event.rowIndex, event)
    setEditingEvent(null)
    await load()
  }

  const handleDelete = async (event) => {
    if (!confirm(`"${event.title}" 일정을 삭제할까요?`)) return
    await deleteEvent(event.rowIndex)
    setPopup(null)
    await load()
  }

  // 팝업 날짜의 일정을 최신 events로 갱신
  const popupEvents = popup
    ? events.filter(e => {
        const end = e.endDate || e.startDate
        return popup.date >= e.startDate && popup.date <= end
      })
    : []

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📅 일정 캘린더</h1>
        {loading && <span className="loading-badge">불러오는 중...</span>}
        
          className="sheets-link"
          href="https://docs.google.com/spreadsheets/d/1uIKpU3amR6DkFoIaqBCHE6gYV60zHbJXQeyR9tdPiXU/edit"
          target="_blank"
          rel="noopener noreferrer"
        >
          🟩 구글 시트 열기
        </a>
      </header>

      <div className="app-body">
        {/* 좌측: 입력 폼 */}
        <aside className="sidebar">
          {popup ? (
            <DayPopup
              date={popup.date}
              events={popupEvents}
              subjects={subjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClose={() => setPopup(null)}
            />
          ) : (
            <InputForm
              subjects={subjects}
              onAdd={handleAdd}
              editingEvent={editingEvent}
              onUpdate={handleUpdate}
              onCancelEdit={() => setEditingEvent(null)}
            />
          )}
        </aside>

        {/* 사이드바 하단 구글 시트 버튼 */}
        <a
          className="sheets-link"
          href="https://docs.google.com/spreadsheets/d/1uIKpU3amR6DkFoIaqBCHE6gYV60zHbJXQeyR9tdPiXU/edit"
          target="_blank"
          rel="noopener noreferrer"
        >
          🟩 구글 시트 열기
        </a>

        {/* 우측: 캘린더 */}
        <main className="cal-main">
          <Calendar
            events={events}
            subjects={subjects}
            onDayClick={handleDayClick}
          />
        </main>
      </div>
    </div>
  )
}
