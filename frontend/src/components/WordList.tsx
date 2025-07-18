import React from 'react'

interface Word {
  id: number
  word: string
  meaning: string
  createdAt: string
}

interface WordListProps {
  words: Word[]
  onWordSelect: (word: Word) => void
}

const WordList: React.FC<WordListProps> = ({ words, onWordSelect }) => {
  return (
    <div className="word-list">
      <h2>검색한 단어</h2>
      
      {words.length === 0 ? (
        <div className="empty-list">
          <p>검색한 단어가 없습니다.</p>
        </div>
      ) : (
        <div className="word-items">
          {words.map((word) => (
            <div 
              key={word.id}
              className="word-item"
              onClick={() => onWordSelect(word)}
            >
              <div className="word-text">{word.word}</div>
              <div className="word-date">
                {new Date(word.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WordList 