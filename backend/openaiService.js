const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 단어 의미를 가져오는 함수
const getWordMeaning = async (word) => {
  try {
    console.log('OpenAI 서비스 시작 - 단어:', word);
    console.log('OpenAI API 키 상태:', process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음');

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    console.log('OpenAI API 요청 생성 중...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 한국어 단어 사전입니다. 사용자가 제공한 단어에 대해 명확하고 이해하기 쉬운 설명을 제공해주세요. 
          
          응답 형식:
          - 단어의 뜻을 명확히 설명
          - 품사 정보 포함
          - 사용 예시 1-2개 제공
          - 유의어나 반의어가 있다면 포함
          - 어원이나 추가 정보가 있다면 간단히 설명`
        },
        {
          role: "user",
          content: `"${word}"에 대해 설명해주세요.`
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    console.log('OpenAI API 응답 받음 - 상태:', response.choices?.[0]?.message?.content ? '성공' : '실패');
    console.log('응답 길이:', response.choices?.[0]?.message?.content?.length || 0);

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 상세 오류:', {
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status,
      word: word,
      timestamp: new Date().toISOString()
    });
    
    // 더 구체적인 에러 메시지 제공
    if (error.code === 'invalid_api_key') {
      throw new Error('OpenAI API 키가 유효하지 않습니다.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API 사용량이 초과되었습니다.');
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI API 호출 제한이 초과되었습니다.');
    } else {
      throw new Error('단어 의미를 가져오는 중 오류가 발생했습니다.');
    }
  }
};

// 댓글 질문에 답변하는 함수 (대화 히스토리 포함)
const getCommentAnswer = async (word, question, previousComments = []) => {
  try {
    const messages = [
      {
        role: "system",
        content: `사용자의 질문에 대해 친근하고 자세한 답변을 해주세요. 답변은 일반 텍스트로 작성해주세요'
        
        응답 시 유의사항:
        - 이전 질문과 답변의 맥락을 고려하여 답변
        - 질문과 관련된 정확한 정보 제공
        - 이해하기 쉬운 설명
        - 필요시 예시 제공
        - 간결하면서도 충분한 설명
        - 이전 대화 내용과 연관성이 있다면 언급하며 답변`
      }
    ];

    // 이전 댓글들을 대화 히스토리에 추가
    previousComments.forEach(comment => {
      messages.push({
        role: "user",
        content: `"${word}"라는 단어에 대한 질문: ${comment.question}`
      });
      messages.push({
        role: "assistant",
        content: comment.answer
      });
    });

    // 현재 질문 추가
    messages.push({
      role: "user",
      content: `"${word}"라는 단어에 대한 질문: ${question}`
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('질문에 대한 답변을 가져오는 중 오류가 발생했습니다.');
  }
};

module.exports = {
  getWordMeaning,
  getCommentAnswer
}; 