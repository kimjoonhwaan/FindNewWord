import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WordSearch from './components/WordSearch'
import WordList from './components/WordList'
import WordDetail from './components/WordDetail'
import './App.css'

interface Word {
  id: number
  word: string
  meaning: string
  createdAt: string
}

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [words, setWords] = useState<Word[]>([])
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)

  // 컴포넌트 마운트 시 기존 단어들 로드
  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/words`)
      setWords(response.data)
    } catch (error) {
      console.error('단어 목록 로드 실패:', error)
    }
  }

  const handleWordAdded = (newWord: Word) => {
    setWords(prev => [...prev, newWord])
  }

  const handleWordSelect = (word: Word) => {
    setSelectedWord(word)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>단어 정리 웹앱</h1>
        
        <div className="main-content">
          <div className="left-panel">
            <WordSearch onWordAdded={handleWordAdded} />
            <WordList words={words} onWordSelect={handleWordSelect} />
          </div>
          
          <div className="right-panel">
            {selectedWord ? (
              <WordDetail word={selectedWord} />
            ) : (
              <div className="no-selection">
                <p>단어를 선택하여 상세 정보를 확인하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 