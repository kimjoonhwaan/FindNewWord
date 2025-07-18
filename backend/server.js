const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database');
const { getWordMeaning, getCommentAnswer } = require('./openaiService');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://findnewwordfront-production.up.railway.app'
  ],
  credentials: true
}));
app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 디버깅 엔드포인트 (환경변수 확인)
app.get('/api/debug', (req, res) => {
  res.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none'
    },
    timestamp: new Date().toISOString()
  });
});

// 단어 검색 API
app.post('/api/words/search', async (req, res) => {
  const { word } = req.body;
  
  console.log('단어 검색 요청:', { word, timestamp: new Date().toISOString() });

  if (!word) {
    return res.status(400).json({ error: '단어를 입력해주세요.' });
  }

  try {
    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API 키가 설정되지 않았습니다.');
      return res.status(500).json({ error: 'OpenAI API 키가 설정되지 않았습니다.' });
    }

    console.log('OpenAI API 키 확인됨');

    // 기존에 검색된 단어인지 확인
    const existingWord = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM words WHERE word = ?',
        [word],
        (err, row) => {
          if (err) {
            console.error('데이터베이스 조회 오류:', err);
            reject(err);
          } else {
            console.log('기존 단어 검색 결과:', row ? '발견됨' : '없음');
            resolve(row);
          }
        }
      );
    });

    if (existingWord) {
      console.log('기존 단어 반환:', existingWord.word);
      // 기존 단어가 있으면 그대로 반환
      return res.json({
        id: existingWord.id,
        word: existingWord.word,
        meaning: existingWord.meaning,
        createdAt: existingWord.created_at
      });
    }

    console.log('OpenAI API 호출 시작:', word);
    // 새로운 단어면 OpenAI API로 의미를 가져옴
    const meaning = await getWordMeaning(word);
    console.log('OpenAI API 응답 받음, 길이:', meaning.length);

    // 데이터베이스에 저장
    console.log('데이터베이스 저장 시작');
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO words (word, meaning) VALUES (?, ?)',
        [word, meaning],
        function(err) {
          if (err) {
            console.error('데이터베이스 저장 오류:', err);
            reject(err);
          } else {
            console.log('데이터베이스 저장 완료, ID:', this.lastID);
            resolve(this.lastID);
          }
        }
      );
    });

    // 저장된 단어 정보 반환
    const savedWord = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM words WHERE id = ?',
        [result],
        (err, row) => {
          if (err) {
            console.error('저장된 단어 조회 오류:', err);
            reject(err);
          } else {
            console.log('저장된 단어 조회 완료');
            resolve(row);
          }
        }
      );
    });

    console.log('요청 처리 완료:', savedWord.word);
    res.json({
      id: savedWord.id,
      word: savedWord.word,
      meaning: savedWord.meaning,
      createdAt: savedWord.created_at
    });

  } catch (error) {
    console.error('단어 검색 상세 오류:', {
      message: error.message,
      stack: error.stack,
      word: word,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: '단어 검색 중 오류가 발생했습니다.' });
  }
});

// 모든 단어 조회 API
app.get('/api/words', async (req, res) => {
  try {
    const words = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM words ORDER BY created_at DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const formattedWords = words.map(word => ({
      id: word.id,
      word: word.word,
      meaning: word.meaning,
      createdAt: word.created_at
    }));

    res.json(formattedWords);
  } catch (error) {
    console.error('단어 목록 조회 오류:', error);
    res.status(500).json({ error: '단어 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});

// 특정 단어의 댓글 조회 API
app.get('/api/words/:wordId/comments', async (req, res) => {
  const { wordId } = req.params;

  try {
    const comments = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM comments WHERE word_id = ? ORDER BY created_at DESC',
        [wordId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      wordId: comment.word_id,
      question: comment.question,
      answer: comment.answer,
      createdAt: comment.created_at
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ error: '댓글을 가져오는 중 오류가 발생했습니다.' });
  }
});

// 댓글 추가 API
app.post('/api/words/:wordId/comments', async (req, res) => {
  const { wordId } = req.params;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: '질문을 입력해주세요.' });
  }

  try {
    // 단어 정보 가져오기
    const word = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM words WHERE id = ?',
        [wordId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!word) {
      return res.status(404).json({ error: '단어를 찾을 수 없습니다.' });
    }

    // 이전 댓글들 가져오기
    const previousComments = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM comments WHERE word_id = ? ORDER BY created_at ASC',
        [wordId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // OpenAI API로 답변 생성 (이전 댓글들 포함)
    const answer = await getCommentAnswer(word.word, question, previousComments);

    // 댓글 저장
    const commentId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO comments (word_id, question, answer) VALUES (?, ?, ?)',
        [wordId, question, answer],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // 저장된 댓글 정보 반환
    const savedComment = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM comments WHERE id = ?',
        [commentId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    res.json({
      id: savedComment.id,
      wordId: savedComment.word_id,
      question: savedComment.question,
      answer: savedComment.answer,
      createdAt: savedComment.created_at
    });

  } catch (error) {
    console.error('댓글 추가 오류:', error);
    res.status(500).json({ error: '댓글을 추가하는 중 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app; 