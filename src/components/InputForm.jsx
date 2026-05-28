import { useState, useEffect } from 'react'

export default function InputForm({ subjects, onAdd, editingEvent, onUpdate, onCancelEdit }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    title: '',
    subject: '',
    memo: '',
  })

  useEffect(() => {
    if (editingEvent) {
      setForm({
        startDate: editingEvent.startDate,
        endDate: editingEvent.endDate,
        title: editingEvent.title,
        subject: editingEvent.subject,
        memo: editingEvent.memo,
      })
    }
  }, [editingEvent])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.startDate || !form.title || !form.subject) {
      alert('시작일, 내용, 주제는 필수입니다.')
      return
    }
    if (editingEvent) {
      await onUpdate({ ...editingEvent, ...form })
    } else {
      await onAdd(form)
    }
    setForm({ startDate: '', endDate: '', title: '', subject: '', memo: '' })
  }

  const handleCancel = () => {
    setForm({ startDate: '', endDate: '', title: '', subject: '', memo: '' })
    onCancelEdit()
  }

  return (
    <div className="input-form">
      <h2 className="form-title">{editingEvent ? '일정 수정' : '일정 추가'}</h2>

      <div className="field">
        <label>시작일 <span className="required">*</span></label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      </div>

      <div className="field">
        <label>종료일</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
      </div>

      <div className="field">
        <label>내용 <span className="required">*</span></label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="일정 내용을 입력하세요"
        />
      </div>

      <div className="field">
        <label>주제 <span className="required">*</span></label>
        <select name="subject" value={form.subject} onChange={handleChange}>
          <option value="">선택하세요</option>
          {subjects.map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>메모</label>
        <textarea
          name="memo"
          value={form.memo}
          onChange={handleChange}
          placeholder="추가 메모 (선택)"
          rows={3}
        />
      </div>

      <div className="form-buttons">
        {editingEvent && (
          <button className="btn-cancel" onClick={handleCancel}>취소</button>
        )}
        <button className="btn-submit" onClick={handleSubmit}>
          {editingEvent ? '수정 완료' : '추가'}
        </button>
      </div>
    </div>
  )
}
