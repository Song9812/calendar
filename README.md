# 📅 일정 캘린더

Google Sheets 연동 캘린더 웹앱입니다.

## 기술 스택
- React + Vite
- Google Sheets API
- Vercel 배포

## 로컬 실행

```bash
npm install
npm run dev
```

## GitHub → Vercel 배포 방법

1. GitHub에 이 프로젝트를 push합니다.
2. [vercel.com](https://vercel.com) 접속 → **New Project**
3. GitHub 저장소 연결
4. Framework Preset: **Vite** 선택
5. **Deploy** 클릭

## 구글 시트 구조

**Sheet1 — 일정**
| 일정시작일 | 일정종료일 | 내용 | 주제 | 완료여부 | 메모 |

**Sheet2 — 주제**
| 주제명 | 색상 |
| 학급 | 하늘색 |
| 교과 | 연두색 |
| 행정 | 노랑 |

## 주의사항
- 구글 시트는 **"링크 있는 모든 사용자 - 편집자"** 로 공유 설정 필요
- API 키는 `src/utils/sheets.js` 에서 수정 가능
