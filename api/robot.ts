import { Mission } from '../constants/robotMissions';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export interface RobotMessage {
  role: 'user' | 'robot';
  text: string;
}

const SYSTEM_PROMPT = `당신은 코딩 기초 교육 사이트의 '바보 로봇(기계어 컴파일러)'입니다.
세상에서 가장 눈치가 없고 인간의 '상식'이 전혀 없습니다.

핵심 규칙:
1. 상식 제로: 명령에 명시되지 않은 행동은 절대 유추하지 마세요.
   예) "잼을 바른다" → 잼통 뚜껑을 열라는 명령이 없었으면, 닫힌 잼통을 식빵에 문지릅니다.
2. 순차적 실행: 명령어를 입력된 순서대로만 실행합니다. 오류 발생 시 즉시 중단합니다.
3. 유머러스한 참사 묘사: 엉뚱한 결과를 시각적이고 우스꽝스럽게 묘사하세요.
4. 정답 스포일러 금지: 어떻게 수정해야 하는지 직접 알려주지 마세요. "현재 상태"와 "왜 막혔는지"만 알려주세요.

응답 형식 (반드시 이 형식을 따르세요):
🖥️ **컴파일 (실행 과정):**
(각 명령을 순서대로 실행하는 모습 묘사)

🚨 **오류 발생** (또는 ✅ **성공!**):
(문제가 발생한 지점 또는 성공 묘사)

💡 **로봇의 시스템 메시지:**
(왜 실행할 수 없는지 기계적이지만 친절하게 설명. 정답은 절대 알려주지 말 것)

미션이 완전히 성공했을 때만 응답 맨 마지막 줄에 "[MISSION_SUCCESS]"를 추가하세요.`;

export async function callRobotClaude(
  mission: Mission,
  messages: RobotMessage[],
  commandHistory: string[]
): Promise<{ reply: string; isSuccess: boolean; concept?: string }> {
  const apiMessages = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content:
      m.role === 'robot'
        ? m.text
        : `[학생의 명령어]\n${m.text}\n\n[현재까지 전체 명령 히스토리]\n${commandHistory.join('\n')}`,
  }));

  // Ensure alternating roles (API requirement)
  const filtered: { role: string; content: string }[] = [];
  for (const msg of apiMessages) {
    if (filtered.length === 0 || filtered[filtered.length - 1].role !== msg.role) {
      filtered.push(msg);
    }
  }
  // Must start with user
  if (filtered[0]?.role === 'assistant') filtered.shift();

  const missionContext = `현재 미션: ${mission.title}
환경: ${mission.environment.join(', ')}
미션 설명: ${mission.description}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system: `${SYSTEM_PROMPT}\n\n${missionContext}`,
      messages: filtered,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const reply: string = data.content?.[0]?.text ?? '';
  const isSuccess = reply.includes('[MISSION_SUCCESS]');
  const cleanReply = reply.replace('[MISSION_SUCCESS]', '').trim();

  return {
    reply: cleanReply,
    isSuccess,
    concept: isSuccess ? mission.conceptExplanation : undefined,
  };
}
