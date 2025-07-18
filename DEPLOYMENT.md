# 🚀 단어 정리 웹앱 배포 가이드

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정
- OpenAI API 키 준비
- 도메인 주소 확인 (배포 후)

### 2. 코드 준비
- ✅ API 엔드포인트를 환경 변수로 설정 완료
- ✅ CORS 설정 완료
- ✅ 프로덕션 빌드 스크립트 준비

## 🌐 배포 방법

### 방법 1: Railway (추천) - 풀스택 통합 배포

#### 1단계: Railway 계정 설정
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login
```

#### 2단계: 프로젝트 생성
```bash
# 프로젝트 루트에서 실행
railway new

# 또는 GitHub 연결
railway link
```

#### 3단계: 환경 변수 설정
Railway 대시보드에서 설정:
- `OPENAI_API_KEY`: OpenAI API 키
- `PORT`: 5000 (백엔드용)
- `VITE_API_URL`: 백엔드 배포 URL

#### 4단계: 배포
```bash
# 백엔드 배포
cd backend
railway up

# 프론트엔드 배포
cd ../frontend
railway up
```

### 방법 2: Vercel + Railway 조합

#### 백엔드 (Railway)
```bash
cd backend
railway new
railway up
```

#### 프론트엔드 (Vercel)
```bash
cd frontend
npm install -g vercel
vercel

# 환경 변수 설정
vercel env add VITE_API_URL
```

### 방법 3: Render 무료 배포

#### 1단계: GitHub 연결
1. GitHub에 코드 푸시
2. Render.com에서 GitHub 연결

#### 2단계: 백엔드 배포
- Service Type: Web Service
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `OPENAI_API_KEY`: OpenAI API 키

#### 3단계: 프론트엔드 배포
- Service Type: Static Site
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment Variables:
  - `VITE_API_URL`: 백엔드 URL

## 📝 수동 서버 배포

### Ubuntu/Linux 서버에 배포

#### 1단계: 서버 준비
```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
npm install -g pm2
```

#### 2단계: 코드 배포
```bash
# 코드 클론
git clone <your-repo-url>
cd project06

# 백엔드 설정
cd backend
npm install
cp .env.example .env
# .env 파일에 OpenAI API 키 설정

# 프론트엔드 빌드
cd ../frontend
npm install
npm run build
```

#### 3단계: 백엔드 실행
```bash
cd backend
pm2 start server.js --name "word-dictionary-backend"
```

#### 4단계: 프론트엔드 서빙
```bash
# Nginx 설치
sudo apt install nginx

# 프론트엔드 빌드 파일 복사
sudo cp -r frontend/dist/* /var/www/html/

# Nginx 설정
sudo nano /etc/nginx/sites-available/default
```

Nginx 설정 예시:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 프론트엔드
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 백엔드 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 환경 변수 설정 가이드

### 백엔드 환경 변수
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=production
```

### 프론트엔드 환경 변수
```env
VITE_API_URL=https://your-backend-url.com
```

## 📊 배포 후 확인사항

### 1. 백엔드 API 테스트
```bash
curl https://your-backend-url/api/words
```

### 2. 프론트엔드 접속 확인
- 웹 브라우저에서 접속
- 단어 검색 기능 테스트
- 댓글 기능 테스트

### 3. 데이터베이스 확인
- SQLite 파일 생성 확인
- 데이터 저장 테스트

## 🔧 문제 해결

### 일반적인 문제들

#### 1. CORS 오류
```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com']
}));
```

#### 2. 환경 변수 인식 안됨
- Railway: 대시보드에서 확인
- Vercel: `vercel env ls`로 확인
- Render: 설정 페이지에서 확인

#### 3. 빌드 오류
```bash
# 캐시 클리어
npm run build -- --force
```

## 🎯 추천 배포 플랫폼 비교

| 플랫폼 | 장점 | 단점 | 비용 |
|--------|------|------|------|
| Railway | 간단한 배포, SQLite 지원 | 무료 제한 | 무료/유료 |
| Vercel | 빠른 CDN, 자동 배포 | 백엔드 제한 | 무료/유료 |
| Render | 무료 플랜, 풀스택 지원 | 느린 콜드 스타트 | 무료/유료 |
| Netlify | 정적 사이트 특화 | 백엔드 제한 | 무료/유료 |

## 🚀 빠른 배포 (Railway 추천)

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

이제 배포 완료! 🎉 