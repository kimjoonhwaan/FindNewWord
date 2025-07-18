import { useState } from 'react'
import axios from 'axios'

interface Word {
  id: number
  word: string
  meaning: string
  createdAt: string
}

interface WordSearchProps {
  onWordAdded: (word: Word) => void
}

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000'

const WordSearch: React.FC<WordSearchProps> = ({ onWordAdded }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError('단어를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_BASE_URL}/api/words/search`, {
        word: searchTerm.trim()
      })
      
      onWordAdded(response.data)
      setSearchTerm('')
    } catch (err) {
      setError('단어를 찾을 수 없습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="word-search">
      <h2>단어 검색</h2>
      <form onSubmit={handleSearch}>
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색할 단어를 입력하세요..."
            disabled={isLoading}
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}

export default WordSearch 