# 단어 정리 웹앱 (Word Dictionary App)

ChatGPT API를 활용한 단어 검색 및 정리 웹 애플리케이션입니다.

## 🎯 주요 기능

1. **단어 검색**: gpt-4o-mini API를 통해 단어에 대한 상세한 해석 제공
2. **단어 목록**: 검색한 단어들을 목록으로 관리 및 선택
3. **댓글 시스템**: 각 단어에 대한 추가 질문과 답변 기능
4. **문맥 이해**: 이전 질문과 답변을 기억하여 연속된 대화 가능
5. **데이터 저장**: 검색한 단어, 해석, 댓글을 SQLite 데이터베이스에 영구 저장
6. **반응형 UI**: 모바일 및 데스크톱 환경 모두 지원

## 🛠 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **AI**: OpenAI API (gpt-4o-mini)
- **HTTP Client**: Axios
- **Dev Tools**: Nodemon, ESLint

## 📁 프로젝트 구조

```
project06/
├── backend/
│   ├── database.js          # SQLite 데이터베이스 설정
│   ├── openaiService.js     # OpenAI API 서비스
│   ├── server.js            # Express 서버 메인 파일
│   ├── package.json         # 백엔드 의존성
│   ├── dictionary.db        # SQLite 데이터베이스 파일
│   └── .env                 # 환경 변수 (API 키)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WordSearch.tsx    # 단어 검색 컴포넌트
│   │   │   ├── WordList.tsx      # 단어 목록 컴포넌트
│   │   │   └── WordDetail.tsx    # 단어 상세 정보 컴포넌트
│   │   ├── App.tsx              # 메인 앱 컴포넌트
│   │   ├── App.css              # 앱 스타일
│   │   ├── index.css            # 글로벌 스타일
│   │   └── main.tsx             # React 앱 진입점
│   ├── index.html               # HTML 템플릿
│   ├── vite.config.ts           # Vite 설정
│   ├── tsconfig.json            # TypeScript 설정
│   └── package.json             # 프론트엔드 의존성
└── README.md                    # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 백엔드 설정
```bash
cd backend
npm install
```

### 2. 프론트엔드 설정
```bash
cd frontend
npm install
```

### 3. 환경 변수 설정
`backend/.env` 파일을 생성하고 OpenAI API 키를 설정하세요:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 4. 서버 실행
**백엔드 서버 실행:**
```bash
cd backend
npm run dev
```

**프론트엔드 서버 실행:**
```bash
cd frontend
npm run dev
```

### 5. 접속
- **프론트엔드**: `http://localhost:3000`
- **백엔드 API**: `http://localhost:5000`

## 📊 데이터베이스 구조

### Words 테이블
- `id`: 고유 식별자
- `word`: 검색한 단어
- `meaning`: AI가 생성한 단어 해석
- `created_at`: 검색 일시

### Comments 테이블
- `id`: 고유 식별자
- `word_id`: 단어 외래키
- `question`: 사용자 질문
- `answer`: AI 답변
- `created_at`: 질문 일시

## 🔧 API 엔드포인트

### 단어 관련
- `POST /api/words/search` - 단어 검색 및 저장
- `GET /api/words` - 모든 단어 조회

### 댓글 관련
- `GET /api/words/:wordId/comments` - 특정 단어의 댓글 조회
- `POST /api/words/:wordId/comments` - 댓글 추가

## 🎨 주요 특징

### 1. 문맥 이해 기능
- 이전 질문과 답변을 기억하여 연속된 대화 지원
- 대화 히스토리를 OpenAI API에 포함하여 전송

### 2. 반응형 디자인
- 모바일과 데스크톱 환경 모두 지원
- 깔끔하고 직관적인 UI/UX

### 3. 실시간 업데이트
- 검색 즉시 목록에 추가
- 댓글 작성 시 실시간 표시

### 4. 데이터 영속성
- SQLite를 사용한 로컬 데이터베이스
- 새로고침 시에도 데이터 유지

## 🎯 사용 방법

1. **단어 검색**
   - 검색창에 단어를 입력하고 "검색" 버튼 클릭
   - AI가 상세한 해석을 제공

2. **단어 선택**
   - 왼쪽 목록에서 검색한 단어 클릭
   - 오른쪽에 상세 정보 표시

3. **추가 질문**
   - 단어 상세 페이지 하단의 텍스트 영역에 질문 입력
   - "질문하기" 버튼으로 AI와 대화

4. **문맥 대화**
   - 이전 질문과 연관된 추가 질문 가능
   - AI가 대화 맥락을 기억하여 답변

## 🔨 개발 정보

### 주요 라이브러리
- **React**: 사용자 인터페이스
- **TypeScript**: 타입 안정성
- **Express**: 백엔드 서버
- **SQLite3**: 데이터베이스
- **OpenAI**: AI 모델
- **Axios**: HTTP 클라이언트
- **Nodemon**: 개발 서버

### 성능 최적화
- **gpt-4o-mini**: 빠르고 정확한 AI 모델
- **SQLite**: 경량화된 로컬 데이터베이스
- **React SWC**: 빠른 컴파일

## 🚀 배포하기

### 빠른 배포 (Railway 추천)
```bash
# 1. Railway CLI 설치
npm install -g @railway/cli

# 2. 로그인
railway login

# 3. 백엔드 배포
cd backend
railway new
railway up

# 4. 프론트엔드 배포
cd ../frontend
railway new
railway up

# 5. 환경 변수 설정
railway variables set OPENAI_API_KEY=your_key_here
railway variables set VITE_API_URL=https://your-backend-url.railway.app
```

자세한 배포 가이드는 [`DEPLOYMENT.md`](./DEPLOYMENT.md)를 참조하세요.

### 배포 옵션
- **Railway**: 풀스택 통합 배포 (추천)
- **Vercel + Railway**: 프론트엔드 + 백엔드 분리 배포
- **Render**: 무료 플랜 제공
- **수동 서버**: Ubuntu/Linux 서버에 직접 배포

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**개발 완료일**: 2025-07-15  
**버전**: 1.0.0  
**개발자**: AI Assistant 