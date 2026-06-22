import { Question, QuestionType, Unit } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: '객관식 (4지선다)',
  fill_blank: '빈칸 채우기',
  code_output: '코드 출력 예측',
  error_fix: '오류 찾기',
  concept: '개념 설명형',
};

async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

export const generateQuestion = async (unit: Unit, type?: QuestionType): Promise<Question> => {
  const qType: QuestionType =
    type ??
    (['multiple_choice', 'fill_blank', 'code_output', 'error_fix', 'concept'][
      Math.floor(Math.random() * 5)
    ] as QuestionType);

  const prompt = `당신은 파이썬/AI 교육 전문가입니다. 다음 단원에 맞는 ${QUESTION_TYPE_LABELS[qType]} 문제를 1개 생성해주세요.

단원: ${unit.title} (${unit.subtitle})
주제 목록: ${unit.topics.join(', ')}
레벨: ${unit.level}
문제 유형: ${QUESTION_TYPE_LABELS[qType]}

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "type": "${qType}",
  "prompt": "문제 내용",
  "code": "코드 블록 (있는 경우, 없으면 null)",
  "choices": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "answer": "정답",
  "explanation": "해설 (2-3문장)"
}

객관식이 아닌 경우 choices는 null로 설정하세요.`;

  const text = await callClaude(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response from Claude');

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    id: `${unit.id}_${Date.now()}`,
    type: qType,
    unitId: unit.id,
    prompt: parsed.prompt,
    code: parsed.code ?? undefined,
    choices: parsed.choices ?? undefined,
    answer: parsed.answer,
    explanation: parsed.explanation,
  };
};

export const getHint = async (question: Question): Promise<string> => {
  const prompt = `다음 파이썬 문제에 대한 힌트를 한 문장으로 알려주세요. 정답은 직접 알려주지 마세요.

문제: ${question.prompt}
${question.code ? `코드:\n${question.code}` : ''}

힌트만 간결하게 답하세요.`;

  return callClaude(prompt, 200);
};

export const getExplanation = async (question: Question, userAnswer: string): Promise<string> => {
  const prompt = `파이썬 문제 해설을 친절하게 설명해주세요.

문제: ${question.prompt}
${question.code ? `코드:\n${question.code}` : ''}
학생 답변: ${userAnswer}
정답: ${question.answer}
기본 해설: ${question.explanation}

학생 답변이 틀렸다면 왜 틀렸는지, 정답이라면 왜 맞는지 2-3문장으로 추가 설명해주세요.`;

  return callClaude(prompt, 400);
};
