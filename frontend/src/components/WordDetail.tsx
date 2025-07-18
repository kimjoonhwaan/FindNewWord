import { useState, useEffect } from 'react'
import axios from 'axios'

interface Word {
  id: number
  word: string
  meaning: string
  createdAt: string
}

interface Comment {
  id: number
  wordId: number
  question: string
  answer: string
  createdAt: string
}

interface WordDetailProps {
  word: Word
}

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000'

const WordDetail: React.FC<WordDetailProps> = ({ word }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadComments()
  }, [word.id])

  const loadComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/words/${word.id}/comments`)
      setComments(response.data)
    } catch (err) {
      console.error('댓글 로드 실패:', err)
    }
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuestion.trim()) {
      setError('질문을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_BASE_URL}/api/words/${word.id}/comments`, {
        question: newQuestion.trim()
      })
      
      setComments(prev => [...prev, response.data])
      setNewQuestion('')
    } catch (err) {
      setError('질문을 처리할 수 없습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="word-detail">
      <div className="word-header">
        <h2>{word.word}</h2>
        <span className="word-date">
          검색일: {new Date(word.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
      
      <div className="word-meaning">
        <h3>의미</h3>
        <div className="meaning-content">
          {word.meaning}
        </div>
      </div>

      <div className="comments-section">
        <h3>추가 질문 및 답변</h3>
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">
              <p>아직 질문이 없습니다.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-question">
                  <strong>Q:</strong> {comment.question}
                </div>
                <div className="comment-answer">
                  <strong>A:</strong> {comment.answer}
                </div>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmitQuestion} className="comment-form">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="이 단어에 대한 추가 질문을 입력하세요..."
            disabled={isLoading}
            rows={3}
            className="comment-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !newQuestion.trim()}
            className="comment-submit"
          >
            {isLoading ? '처리 중...' : '질문하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WordDetail 