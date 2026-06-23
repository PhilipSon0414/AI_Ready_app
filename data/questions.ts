export type Question = {
  id: string;
  unit: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  cloze?: { sentence: string; answers: string[] };
};

export type Unit = {
  id: string;
  title: string;
  icon: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  unitType?: "quiz" | "baboRobot";
  questions: Question[];
};

// ─────────────────────────────────────────────
// LEVEL 0 – AI 완전 입문 🌿
// ─────────────────────────────────────────────
const u0_1_questions: Question[] = [
  {
    id: 'u0_1q1', unit: 'u0_1', topic: 'AI 기초', level: 0,
    question: '인공지능(AI)은 무엇을 할 수 있나요?',
    options: [
      '사람처럼 생각하고 학습하는 것',
      '물리적 힘을 쓰는 것',
      '인터넷 없이 작동하는 것',
      '모든 일을 완벽히 하는 것',
    ],
    answer: 0,
    explanation: 'AI(인공지능)는 컴퓨터가 사람처럼 생각하고 학습하며 문제를 해결할 수 있도록 만든 기술입니다.',
    cloze: { sentence: '인공지능(AI)은 컴퓨터가 사람처럼 ___ 할 수 있도록 만든 기술입니다.', answers: ['생각하고 학습'] },
  },
  {
    id: 'u0_1q2', unit: 'u0_1', topic: 'AI 기초', level: 0,
    question: '우리 일상에서 AI를 사용하는 예시는?',
    options: [
      '종이책',
      '스마트폰 음성 비서',
      '자전거',
      '연필',
        ],
    answer: 1,
    explanation: '스마트폰의 음성 비서(예: 시리, 빅스비)는 AI를 활용하여 우리 말을 이해하고 답변합니다.',
    cloze: { sentence: '스마트폰 ___ 는 AI를 활용하여 우리 말을 이해하고 답변합니다.', answers: ['음성 비서'] },
  },
  {
    id: 'u0_1q3', unit: 'u0_1', topic: 'AI 기초', level: 0,
    question: '넷플릭스가 내가 좋아할 영화를 추천해주는 것은 어떤 기술인가요?',
    options: [
      '직원이 직접 고름',
      '랜덤 선택',
      'AI 추천 시스템',
      '인기순 정렬',
        ],
    answer: 2,
    explanation: '넷플릭스는 AI 추천 시스템을 사용해 사용자의 시청 기록을 분석하고 좋아할 만한 영화를 추천합니다.',
    cloze: { sentence: '넷플릭스는 AI ___ 을 사용해 사용자에게 맞춤 영화를 추천합니다.', answers: ['추천 시스템'] },
  },
  {
    id: 'u0_1q4', unit: 'u0_1', topic: 'AI 기초', level: 0,
    question: 'AI가 점점 발전하면서 가장 크게 변할 분야는?',
    options: [
      '예술과 창의 활동',
      '인간관계',
      '스포츠',
      '반복적이고 규칙적인 업무',
        ],
    answer: 3,
    explanation: 'AI는 공장 생산, 데이터 입력 같은 반복적이고 규칙적인 업무를 자동화하는 데 특히 뛰어납니다.',
    cloze: { sentence: 'AI는 ___ 업무를 자동화하는 데 특히 뛰어납니다.', answers: ['반복적이고 규칙적인'] },
  },
];

const u0_2_questions: Question[] = [
  {
    id: 'u0_2q1', unit: 'u0_2', topic: 'AI 학습', level: 0,
    question: '머신러닝에서 AI는 어떻게 학습하나요?',
    options: [
      '많은 데이터를 보고 패턴을 찾아서',
      '사람이 규칙을 직접 입력해서',
      '인터넷을 검색해서',
      '책을 읽어서',
    ],
    answer: 0,
    explanation: '머신러닝에서 AI는 수많은 데이터를 분석하여 스스로 패턴을 발견하고 학습합니다.',
    cloze: { sentence: '머신러닝에서 AI는 많은 ___ 를 보고 패턴을 찾아서 학습합니다.', answers: ['데이터'] },
  },
  {
    id: 'u0_2q2', unit: 'u0_2', topic: 'AI 학습', level: 0,
    question: 'AI가 고양이 사진을 인식하려면 무엇이 필요한가요?',
    options: [
      '고양이 한 마리',
      '고양이 사진 데이터 수천 장',
      '고양이 그림책',
      '고양이 설명 글',
        ],
    answer: 1,
    explanation: 'AI가 고양이를 인식하려면 다양한 고양이 사진 데이터 수천 장으로 학습해야 합니다.',
    cloze: { sentence: 'AI가 고양이를 인식하려면 고양이 ___ 수천 장이 필요합니다.', answers: ['사진 데이터'] },
  },
  {
    id: 'u0_2q3', unit: 'u0_2', topic: 'AI 학습', level: 0,
    question: 'AI 학습에서 "오답"의 역할은?',
    options: [
      '학습을 방해함',
      '사용하지 않음',
      '틀린 것을 수정하며 더 잘 배우게 함',
      'AI를 재시작함',
        ],
    answer: 2,
    explanation: 'AI는 틀린 답을 통해 무엇이 잘못되었는지 파악하고 수정하면서 더 정확하게 학습합니다.',
    cloze: { sentence: 'AI는 ___ 답을 통해 수정하면서 더 정확하게 학습합니다.', answers: ['틀린'] },
  },
  {
    id: 'u0_2q4', unit: 'u0_2', topic: 'AI 학습', level: 0,
    question: 'AI가 잘 학습하려면 데이터의 양과 질이 어때야 하나요?',
    options: [
      '적어도 됨',
      '한 종류여도 됨',
      '품질보다 양이 중요',
      '많고 다양해야 함',
        ],
    answer: 3,
    explanation: 'AI가 잘 학습하려면 데이터가 많고 다양해야 다양한 상황을 이해할 수 있습니다.',
    cloze: { sentence: 'AI가 잘 학습하려면 데이터가 ___ 해야 합니다.', answers: ['많고 다양'] },
  },
];

const u0_3_questions: Question[] = [
  {
    id: 'u0_3q1', unit: 'u0_3', topic: 'AI 활용', level: 0,
    question: '병원에서 AI가 활용되는 예시는?',
    options: [
      '의료 영상 분석으로 질병 진단 보조',
      '수술 직접 수행',
      '환자 병문안',
      '약 배달',
    ],
    answer: 0,
    explanation: 'AI는 X선, CT 같은 의료 영상을 분석하여 의사가 질병을 진단하는 데 도움을 줍니다.',
    cloze: { sentence: 'AI는 의료 ___ 를 분석하여 질병 진단을 보조합니다.', answers: ['영상'] },
  },
  {
    id: 'u0_3q2', unit: 'u0_3', topic: 'AI 활용', level: 0,
    question: 'AI 번역기가 점점 좋아지는 이유는?',
    options: [
      '사람이 더 많이 개입해서',
      '더 많은 번역 데이터로 학습하기 때문',
      '언어가 단순해져서',
      '번역이 필요 없어져서',
        ],
    answer: 1,
    explanation: 'AI 번역기는 더 많은 번역 데이터를 학습할수록 문맥을 더 잘 이해하고 자연스럽게 번역합니다.',
    cloze: { sentence: 'AI 번역기는 더 많은 ___ 를 학습할수록 더 자연스럽게 번역합니다.', answers: ['번역 데이터'] },
  },
  {
    id: 'u0_3q3', unit: 'u0_3', topic: 'AI 활용', level: 0,
    question: '자율주행차에서 AI가 하는 역할은?',
    options: [
      '차의 엔진 관리',
      '연료 절약',
      '도로 상황 인식하고 운전 결정',
      '음악 재생',
        ],
    answer: 2,
    explanation: '자율주행차의 AI는 카메라와 센서로 도로 상황을 인식하고 안전한 운전 결정을 내립니다.',
    cloze: { sentence: '자율주행차 AI는 도로 ___ 을 인식하고 운전 결정을 내립니다.', answers: ['상황'] },
  },
  {
    id: 'u0_3q4', unit: 'u0_3', topic: 'AI 활용', level: 0,
    question: 'AI 챗봇이 고객 서비스에 사용되는 가장 큰 이유는?',
    options: [
      '인간보다 감정이 풍부해서',
      '더 비싼 서비스를 제공해서',
      '법으로 의무화되어서',
      '24시간 빠른 응답 가능',
        ],
    answer: 3,
    explanation: 'AI 챗봇은 24시간 쉬지 않고 빠르게 고객 질문에 답변할 수 있어 고객 서비스에 널리 사용됩니다.',
    cloze: { sentence: 'AI 챗봇은 ___ 빠른 응답이 가능하여 고객 서비스에 활용됩니다.', answers: ['24시간'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 1 – AI 이름만 들어봤어요 👂
// ─────────────────────────────────────────────
const u1_1_questions: Question[] = [
  {
    id: 'u1_1q1', unit: 'u1_1', topic: 'AI 용어', level: 1,
    question: "'머신러닝'의 정확한 의미는?",
    options: [
      '데이터로부터 스스로 학습하는 AI 기술',
      '기계를 만드는 기술',
      '로봇 공학',
      '컴퓨터 수리',
    ],
    answer: 0,
    explanation: '머신러닝은 컴퓨터가 명시적으로 프로그래밍되지 않아도 데이터로부터 스스로 학습하는 AI 기술입니다.',
    cloze: { sentence: '머신러닝은 ___ 로부터 스스로 학습하는 AI 기술입니다.', answers: ['데이터'] },
  },
  {
    id: 'u1_1q2', unit: 'u1_1', topic: 'AI 용어', level: 1,
    question: "'딥러닝'이 머신러닝과 다른 점은?",
    options: [
      '더 적은 데이터가 필요함',
      '인간 뇌의 신경망 구조를 모방함',
      '학습이 더 느림',
      '규칙을 수동 입력함',
        ],
    answer: 1,
    explanation: '딥러닝은 인간 뇌의 신경망 구조를 모방한 여러 층의 인공신경망을 사용하는 머신러닝의 한 분야입니다.',
    cloze: { sentence: '딥러닝은 인간 뇌의 ___ 구조를 모방한 인공신경망을 사용합니다.', answers: ['신경망'] },
  },
  {
    id: 'u1_1q3', unit: 'u1_1', topic: 'AI 용어', level: 1,
    question: "'알고리즘'이란?",
    options: [
      '컴퓨터 부품',
      '프로그래밍 언어',
      '문제를 해결하는 단계별 절차',
      '데이터베이스',
        ],
    answer: 2,
    explanation: '알고리즘은 특정 문제를 해결하기 위한 단계별 절차나 규칙의 집합입니다.',
    cloze: { sentence: '알고리즘은 문제를 해결하기 위한 ___ 절차입니다.', answers: ['단계별'] },
  },
  {
    id: 'u1_1q4', unit: 'u1_1', topic: 'AI 용어', level: 1,
    question: "'모델'이란 AI에서 무엇을 의미하나요?",
    options: [
      '3D 프린터 출력물',
      '패션 모델',
      '건축 설계도',
      '학습을 통해 만들어진 예측/판단 시스템',
        ],
    answer: 3,
    explanation: 'AI에서 모델은 데이터로 학습하여 새로운 입력에 대해 예측이나 판단을 내릴 수 있는 시스템입니다.',
    cloze: { sentence: 'AI 모델은 데이터로 학습하여 새로운 입력에 대해 ___ 을 내릴 수 있는 시스템입니다.', answers: ['예측'] },
  },
];

const u1_2_questions: Question[] = [
  {
    id: 'u1_2q1', unit: 'u1_2', topic: 'AI 도구', level: 1,
    question: 'ChatGPT는 어떤 종류의 AI인가요?',
    options: [
      '대화형 언어 모델',
      '이미지 생성 AI',
      '번역 전용 AI',
      '음악 생성 AI',
    ],
    answer: 0,
    explanation: 'ChatGPT는 텍스트로 대화를 나눌 수 있는 대화형 언어 모델(LLM) AI입니다.',
    cloze: { sentence: 'ChatGPT는 텍스트로 대화를 나눌 수 있는 ___ AI입니다.', answers: ['대화형 언어 모델'] },
  },
  {
    id: 'u1_2q2', unit: 'u1_2', topic: 'AI 도구', level: 1,
    question: 'Midjourney, DALL-E 같은 AI 도구의 특징은?',
    options: [
      '코드를 작성해줌',
      '텍스트 설명으로 이미지 생성',
      '음성을 텍스트로 변환',
      '데이터 분석',
        ],
    answer: 1,
    explanation: 'Midjourney와 DALL-E는 텍스트로 설명한 내용을 바탕으로 이미지를 생성하는 AI 도구입니다.',
    cloze: { sentence: 'Midjourney와 DALL-E는 ___ 설명으로 이미지를 생성하는 AI입니다.', answers: ['텍스트'] },
  },
  {
    id: 'u1_2q3', unit: 'u1_2', topic: 'AI 도구', level: 1,
    question: 'GitHub Copilot은 어떤 도움을 주나요?',
    options: [
      '프로젝트 관리',
      '버그만 찾아줌',
      '코드 작성 자동 완성 및 제안',
      '디자인 작업',
        ],
    answer: 2,
    explanation: 'GitHub Copilot은 AI를 활용하여 개발자가 코드를 작성할 때 자동으로 코드를 완성하고 제안합니다.',
    cloze: { sentence: 'GitHub Copilot은 AI를 활용하여 코드를 자동으로 ___ 합니다.', answers: ['완성 및 제안'] },
  },
  {
    id: 'u1_2q4', unit: 'u1_2', topic: 'AI 도구', level: 1,
    question: 'AI 도구를 잘 활용하려면 무엇이 중요한가요?',
    options: [
      '빠른 타이핑 실력',
      '비싼 컴퓨터',
      '영어 실력만',
      '명확하고 구체적인 지시(프롬프트)',
        ],
    answer: 3,
    explanation: 'AI 도구를 잘 활용하려면 원하는 결과를 명확하고 구체적으로 지시하는 프롬프트 작성이 중요합니다.',
    cloze: { sentence: 'AI 도구를 잘 활용하려면 명확하고 구체적인 ___ 작성이 중요합니다.', answers: ['프롬프트'] },
  },
];

const u1_3_questions: Question[] = [
  {
    id: 'u1_3q1', unit: 'u1_3', topic: '데이터', level: 1,
    question: 'AI 학습에 가장 중요한 재료는?',
    options: [
      '데이터',
      '전기',
      '인터넷 속도',
      '모니터 크기',
    ],
    answer: 0,
    explanation: 'AI 학습에서 데이터는 가장 핵심적인 재료입니다. 데이터 없이는 AI가 학습할 수 없습니다.',
    cloze: { sentence: 'AI 학습에서 가장 중요한 재료는 ___ 입니다.', answers: ['데이터'] },
  },
  {
    id: 'u1_3q2', unit: 'u1_3', topic: '데이터', level: 1,
    question: "'정형 데이터'의 예시는?",
    options: [
      '사진',
      '엑셀 표의 숫자와 텍스트',
      '영상',
      '음성 파일',
        ],
    answer: 1,
    explanation: '정형 데이터는 행과 열로 구성된 표 형태의 데이터로, 엑셀 표가 대표적인 예입니다.',
    cloze: { sentence: '정형 데이터는 행과 열로 구성된 ___ 형태의 데이터입니다.', answers: ['표'] },
  },
  {
    id: 'u1_3q3', unit: 'u1_3', topic: '데이터', level: 1,
    question: '데이터가 편향되어 있으면 AI는 어떻게 되나요?',
    options: [
      '더 정확해짐',
      '학습을 거부함',
      '편향된 결과를 출력하는 AI가 됨',
      '오류 없이 작동함',
        ],
    answer: 2,
    explanation: 'AI는 학습 데이터의 편향을 그대로 학습하므로, 편향된 데이터로 학습하면 편향된 결과를 출력합니다.',
    cloze: { sentence: '편향된 데이터로 학습한 AI는 ___ 결과를 출력합니다.', answers: ['편향된'] },
  },
  {
    id: 'u1_3q4', unit: 'u1_3', topic: '데이터', level: 1,
    question: '개인정보가 포함된 데이터를 AI 학습에 사용할 때 중요한 것은?',
    options: [
      '더 많이 수집하기',
      '공개적으로 배포하기',
      '무조건 삭제하기',
      '개인정보 보호와 동의',
        ],
    answer: 3,
    explanation: '개인정보가 포함된 데이터는 반드시 당사자의 동의를 받고 개인정보 보호 원칙에 따라 처리해야 합니다.',
    cloze: { sentence: '개인정보가 포함된 데이터는 ___ 보호와 동의가 중요합니다.', answers: ['개인정보'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 2 – AI 개념 이해 중 📖
// ─────────────────────────────────────────────
const u2_1_questions: Question[] = [
  {
    id: 'u2_1q1', unit: 'u2_1', topic: '머신러닝', level: 2,
    question: '지도학습(Supervised Learning)의 특징은?',
    options: [
      '정답 레이블이 있는 데이터로 학습',
      '정답 없이 패턴 발견',
      '환경과 상호작용하며 학습',
      '규칙을 직접 입력',
    ],
    answer: 0,
    explanation: '지도학습은 입력 데이터와 정답(레이블)이 쌍을 이루는 데이터로 모델을 학습시키는 방법입니다.',
    cloze: { sentence: '지도학습은 입력 데이터와 ___ 이 쌍을 이루는 데이터로 학습합니다.', answers: ['정답(레이블)'] },
  },
  {
    id: 'u2_1q2', unit: 'u2_1', topic: '머신러닝', level: 2,
    question: '비지도학습의 대표적인 활용 예시는?',
    options: [
      '스팸 메일 분류',
      '고객 데이터를 유사한 그룹으로 묶기',
      '번역',
      '이미지 인식',
        ],
    answer: 1,
    explanation: '비지도학습은 정답 없이 데이터의 패턴을 찾으며, 고객 데이터를 유사한 그룹으로 묶는 클러스터링이 대표적입니다.',
    cloze: { sentence: '비지도학습의 대표적인 예는 데이터를 유사한 ___ 으로 묶는 클러스터링입니다.', answers: ['그룹'] },
  },
  {
    id: 'u2_1q3', unit: 'u2_1', topic: '머신러닝', level: 2,
    question: '강화학습에서 AI가 학습하는 방법은?',
    options: [
      '정답 데이터로 학습',
      '데이터 없이 규칙 암기',
      '보상과 벌칙으로 최적 행동 학습',
      '사람이 직접 교정',
        ],
    answer: 2,
    explanation: '강화학습에서 AI는 행동에 따른 보상과 벌칙을 통해 최적의 행동을 스스로 학습합니다.',
    cloze: { sentence: '강화학습에서 AI는 ___ 과 벌칙을 통해 최적의 행동을 학습합니다.', answers: ['보상'] },
  },
  {
    id: 'u2_1q4', unit: 'u2_1', topic: '머신러닝', level: 2,
    question: '알파고(AlphaGo)는 어떤 학습 방법을 주로 사용했나요?',
    options: [
      '지도학습만',
      '비지도학습만',
      '규칙 기반',
      '강화학습',
        ],
    answer: 3,
    explanation: '알파고는 강화학습을 주로 사용하여 바둑 게임에서 보상(승리)을 최대화하는 전략을 스스로 학습했습니다.',
    cloze: { sentence: '알파고는 ___ 을 사용하여 바둑에서 이기는 전략을 스스로 학습했습니다.', answers: ['강화학습'] },
  },
];

const u2_2_questions: Question[] = [
  {
    id: 'u2_2q1', unit: 'u2_2', topic: '신경망', level: 2,
    question: '인공신경망의 기본 단위는?',
    options: [
      '뉴런(노드)',
      '픽셀',
      '바이트',
      '알고리즘',
    ],
    answer: 0,
    explanation: '인공신경망은 인간 뇌의 뉴런을 모방한 노드(뉴런)들이 연결된 구조로 이루어져 있습니다.',
    cloze: { sentence: '인공신경망의 기본 단위는 인간 뇌의 뉴런을 모방한 ___ 입니다.', answers: ['노드(뉴런)'] },
  },
  {
    id: 'u2_2q2', unit: 'u2_2', topic: '신경망', level: 2,
    question: "딥러닝에서 '깊다(Deep)'는 무슨 의미인가요?",
    options: [
      '데이터가 많음',
      '여러 층(레이어)의 신경망',
      '학습 시간이 김',
      '복잡한 수식',
        ],
    answer: 1,
    explanation: '딥러닝의 "깊다"는 것은 입력층과 출력층 사이에 여러 개의 은닉층(레이어)이 있다는 의미입니다.',
    cloze: { sentence: '딥러닝의 "깊다"는 것은 여러 개의 ___ 이 있다는 의미입니다.', answers: ['은닉층(레이어)'] },
  },
  {
    id: 'u2_2q3', unit: 'u2_2', topic: '신경망', level: 2,
    question: 'CNN(합성곱 신경망)이 특히 잘하는 작업은?',
    options: [
      '자연어 처리',
      '시계열 분석',
      '이미지 인식',
      '강화학습',
        ],
    answer: 2,
    explanation: 'CNN은 이미지의 공간적 특징을 계층적으로 추출하는 구조로, 이미지 인식과 분류에 탁월합니다.',
    cloze: { sentence: 'CNN은 이미지의 공간적 특징을 추출하여 ___ 에 탁월합니다.', answers: ['이미지 인식'] },
  },
  {
    id: 'u2_2q4', unit: 'u2_2', topic: '신경망', level: 2,
    question: '활성화 함수(Activation Function)의 역할은?',
    options: [
      '학습 속도 조절',
      '데이터 정규화',
      '과적합 방지',
      '비선형성을 추가해 복잡한 패턴 학습',
        ],
    answer: 3,
    explanation: '활성화 함수는 신경망에 비선형성을 추가하여 직선으로 표현할 수 없는 복잡한 패턴도 학습할 수 있게 합니다.',
    cloze: { sentence: '활성화 함수는 신경망에 ___ 을 추가하여 복잡한 패턴 학습을 가능하게 합니다.', answers: ['비선형성'] },
  },
];

const u2_3_questions: Question[] = [
  {
    id: 'u2_3q1', unit: 'u2_3', topic: 'AI 모델 학습', level: 2,
    question: '훈련 데이터, 검증 데이터, 테스트 데이터를 나누는 이유는?',
    options: [
      '모델 성능을 정확히 평가하기 위해',
      '데이터를 절약하기 위해',
      '학습 속도를 높이기 위해',
      '법적 요건을 충족하기 위해',
    ],
    answer: 0,
    explanation: '데이터를 나누는 것은 모델이 학습에 사용하지 않은 새로운 데이터에서 얼마나 잘 작동하는지 공정하게 평가하기 위함입니다.',
    cloze: { sentence: '데이터를 훈련/검증/테스트로 나누는 것은 모델 ___ 을 정확히 평가하기 위해서입니다.', answers: ['성능'] },
  },
  {
    id: 'u2_3q2', unit: 'u2_3', topic: 'AI 모델 학습', level: 2,
    question: "'과적합(Overfitting)'이란?",
    options: [
      '학습이 너무 느린 것',
      '훈련 데이터만 외워서 새 데이터에 성능이 낮아짐',
      '데이터가 부족한 것',
      '모델이 너무 단순한 것',
        ],
    answer: 1,
    explanation: '과적합은 모델이 훈련 데이터를 너무 세밀하게 학습하여 새로운 데이터에는 제대로 작동하지 못하는 현상입니다.',
    cloze: { sentence: '과적합은 모델이 훈련 데이터를 ___ 여 새 데이터에서 성능이 낮아지는 현상입니다.', answers: ['너무 세밀하게 학습하'] },
  },
  {
    id: 'u2_3q3', unit: 'u2_3', topic: 'AI 모델 학습', level: 2,
    question: '손실함수(Loss Function)의 역할은?',
    options: [
      '학습 데이터 선택',
      '모델 구조 결정',
      '모델의 예측이 얼마나 틀렸는지 측정',
      '최종 결과 출력',
        ],
    answer: 2,
    explanation: '손실함수는 모델의 예측값과 실제 정답 간의 차이를 수치로 측정하여 학습 방향을 안내합니다.',
    cloze: { sentence: '손실함수는 모델의 예측값과 실제 정답 간의 ___ 를 측정합니다.', answers: ['차이'] },
  },
  {
    id: 'u2_3q4', unit: 'u2_3', topic: 'AI 모델 학습', level: 2,
    question: '에포크(Epoch)란?',
    options: [
      '학습률',
      '배치 크기',
      '레이어 수',
      '전체 학습 데이터를 한 번 완전히 학습하는 단위',
        ],
    answer: 3,
    explanation: '에포크는 모델이 전체 학습 데이터를 처음부터 끝까지 한 번 완전히 학습하는 단위입니다.',
    cloze: { sentence: '에포크는 전체 학습 데이터를 ___ 완전히 학습하는 단위입니다.', answers: ['한 번'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 3 – 코딩 첫걸음 💻
// ─────────────────────────────────────────────
const u3_1_questions: Question[] = [
  {
    id: 'u3_1q1', unit: 'u3_1', topic: 'Python 기초', level: 3,
    question: 'Python에서 화면에 출력하는 함수는?',
    options: [
      'print()',
      'show()',
      'display()',
      'output()',
    ],
    answer: 0,
    explanation: 'Python에서 화면에 내용을 출력하려면 print() 함수를 사용합니다. 예: print("안녕하세요")',
    cloze: { sentence: 'Python에서 화면에 내용을 출력하려면 ___ 함수를 사용합니다.', answers: ['print()'] },
  },
  {
    id: 'u3_1q2', unit: 'u3_1', topic: 'Python 기초', level: 3,
    question: '다음 중 올바른 Python 변수 선언은?',
    options: [
      'int age = 25',
      'age = 25',
      'var age = 25',
      'age := 25',
        ],
    answer: 1,
    explanation: 'Python에서는 변수 타입을 명시하지 않고 그냥 변수명 = 값 형태로 변수를 선언합니다.',
    cloze: { sentence: 'Python에서 변수는 ___ = 값 형태로 선언합니다.', answers: ['변수명'] },
  },
  {
    id: 'u3_1q3', unit: 'u3_1', topic: 'Python 기초', level: 3,
    question: 'Python에서 문자열(텍스트)을 나타내는 방법은?',
    options: [
      '[안녕하세요]',
      '{안녕하세요}',
      '"안녕하세요"',
      '(안녕하세요)',
        ],
    answer: 2,
    explanation: 'Python에서 문자열은 큰따옴표("") 또는 작은따옴표(\'\')로 감싸서 표현합니다.',
    cloze: { sentence: 'Python에서 문자열은 ___ 또는 작은따옴표로 감싸서 표현합니다.', answers: ['큰따옴표'] },
  },
  {
    id: 'u3_1q4', unit: 'u3_1', topic: 'Python 기초', level: 3,
    question: 'Python 리스트에서 첫 번째 요소의 인덱스는?',
    options: [
      '1',
      '-1',
      'None',
      '0',
        ],
    answer: 3,
    explanation: 'Python에서 리스트의 첫 번째 요소는 인덱스 0으로 접근합니다. 예: my_list[0]',
    cloze: { sentence: 'Python 리스트의 첫 번째 요소는 인덱스 ___ 로 접근합니다.', answers: ['0'] },
  },
];

const u3_2_questions: Question[] = [
  {
    id: 'u3_2q1', unit: 'u3_2', topic: '조건문과 반복문', level: 3,
    question: 'Python에서 조건문을 작성하는 키워드는?',
    options: [
      'if, elif, else',
      'when, then, otherwise',
      'check, do, end',
      'condition, run, stop',
    ],
    answer: 0,
    explanation: 'Python 조건문은 if, elif(else if의 줄임), else 키워드를 사용하여 작성합니다.',
    cloze: { sentence: 'Python 조건문은 ___, elif, else 키워드로 작성합니다.', answers: ['if'] },
  },
  {
    id: 'u3_2q2', unit: 'u3_2', topic: '조건문과 반복문', level: 3,
    question: 'for i in range(5)는 몇 번 반복되나요?',
    options: [
      '4번',
      '5번 (0,1,2,3,4)',
      '6번',
      '무한 반복',
        ],
    answer: 1,
    explanation: 'range(5)는 0, 1, 2, 3, 4의 숫자를 생성하므로 총 5번 반복됩니다.',
    cloze: { sentence: 'range(5)는 0부터 4까지 총 ___ 번 반복됩니다.', answers: ['5'] },
  },
  {
    id: 'u3_2q3', unit: 'u3_2', topic: '조건문과 반복문', level: 3,
    question: 'while 반복문이 멈추는 조건은?',
    options: [
      '10번 실행 후',
      '에러 발생 시만',
      '조건식이 False가 될 때',
      '자동으로 멈추지 않음',
        ],
    answer: 2,
    explanation: 'while 반복문은 조건식이 False가 되면 반복을 멈춥니다. 조건이 항상 True이면 무한 반복됩니다.',
    cloze: { sentence: 'while 반복문은 조건식이 ___ 가 되면 멈춥니다.', answers: ['False'] },
  },
  {
    id: 'u3_2q4', unit: 'u3_2', topic: '조건문과 반복문', level: 3,
    question: '다음 코드의 출력값은? `for i in range(3): print(i)`',
    options: [
      '1, 2, 3',
      '0, 1, 2, 3',
      '3, 3, 3',
      '0, 1, 2',
        ],
    answer: 3,
    explanation: 'range(3)은 0, 1, 2를 생성하므로 print(i)는 0, 1, 2를 순서대로 출력합니다.',
    cloze: { sentence: 'range(3)은 ___, 1, 2를 생성합니다.', answers: ['0'] },
  },
];

const u3_3_questions: Question[] = [
  {
    id: 'u3_3q1', unit: 'u3_3', topic: '함수와 모듈', level: 3,
    question: 'Python에서 함수를 정의하는 키워드는?',
    options: [
      'def',
      'function',
      'func',
      'define',
    ],
    answer: 0,
    explanation: 'Python에서 함수는 def 키워드로 정의합니다. 예: def my_function():',
    cloze: { sentence: 'Python에서 함수는 ___ 키워드로 정의합니다.', answers: ['def'] },
  },
  {
    id: 'u3_3q2', unit: 'u3_3', topic: '함수와 모듈', level: 3,
    question: '`return`문의 역할은?',
    options: [
      '반복문 종료',
      '함수 결과값을 반환',
      '조건 확인',
      '출력',
        ],
    answer: 1,
    explanation: 'return문은 함수의 실행 결과값을 호출한 곳으로 반환합니다. return 없으면 None이 반환됩니다.',
    cloze: { sentence: 'return문은 함수의 실행 ___ 를 호출한 곳으로 반환합니다.', answers: ['결과값'] },
  },
  {
    id: 'u3_3q3', unit: 'u3_3', topic: '함수와 모듈', level: 3,
    question: '`import math`를 사용하는 이유는?',
    options: [
      '변수 선언',
      '화면 출력',
      '수학 관련 함수들을 가져오기 위해',
      '파일 읽기',
        ],
    answer: 2,
    explanation: 'import math를 사용하면 제곱근, 삼각함수 등 수학 관련 함수들을 Python에서 사용할 수 있습니다.',
    cloze: { sentence: 'import math를 사용하면 ___ 관련 함수들을 사용할 수 있습니다.', answers: ['수학'] },
  },
  {
    id: 'u3_3q4', unit: 'u3_3', topic: '함수와 모듈', level: 3,
    question: '함수를 사용하는 가장 큰 장점은?',
    options: [
      '실행 속도 향상',
      '메모리 절약',
      '보안 강화',
      '코드 재사용으로 중복 제거',
        ],
    answer: 3,
    explanation: '함수를 사용하면 같은 코드를 반복 작성하지 않고 필요할 때마다 함수를 호출하여 재사용할 수 있습니다.',
    cloze: { sentence: '함수를 사용하면 코드를 ___ 할 수 있어 중복을 제거합니다.', answers: ['재사용'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 4 – 파이썬 기초 🐍
// ─────────────────────────────────────────────
const u4_1_questions: Question[] = [
  {
    id: 'u4_1q1', unit: 'u4_1', topic: '리스트와 딕셔너리', level: 4,
    question: "Python 딕셔너리에서 값을 가져오는 방법은?",
    options: [
      "dict['key'] 또는 dict.get('key')",
      'dict[0]',
      "dict.value('key')",
      'dict->key',
    ],
    answer: 0,
    explanation: "딕셔너리 값은 dict['key'] 또는 dict.get('key')로 가져옵니다. get()은 키가 없어도 오류가 나지 않습니다.",
    cloze: { sentence: "딕셔너리 값은 dict['key'] 또는 dict.___ ('key')로 가져옵니다.", answers: ['get'] },
  },
  {
    id: 'u4_1q2', unit: 'u4_1', topic: '리스트와 딕셔너리', level: 4,
    question: '리스트 컴프리헨션 `[x*2 for x in range(4)]`의 결과는?',
    options: [
      '[1, 2, 3, 4]',
      '[0, 2, 4, 6]',
      '[0, 1, 2, 3]',
      '[2, 4, 6, 8]',
        ],
    answer: 1,
    explanation: 'range(4)는 0,1,2,3을 생성하고 각각 2를 곱하면 0,2,4,6이 됩니다.',
    cloze: { sentence: '[x*2 for x in range(4)]의 결과는 [0, ___, 4, 6]입니다.', answers: ['2'] },
  },
  {
    id: 'u4_1q3', unit: 'u4_1', topic: '리스트와 딕셔너리', level: 4,
    question: '딕셔너리의 모든 키를 가져오는 방법은?',
    options: [
      'dict.values()',
      'dict.items()',
      'dict.keys()',
      'dict.all()',
        ],
    answer: 2,
    explanation: 'dict.keys()는 딕셔너리의 모든 키를 반환합니다. values()는 값, items()는 키-값 쌍을 반환합니다.',
    cloze: { sentence: '딕셔너리의 모든 키는 dict.___ ()로 가져옵니다.', answers: ['keys'] },
  },
  {
    id: 'u4_1q4', unit: 'u4_1', topic: '리스트와 딕셔너리', level: 4,
    question: '리스트에 요소를 추가하는 메서드는?',
    options: [
      'add()',
      'insert_end()',
      'push()',
      'append()',
        ],
    answer: 3,
    explanation: '리스트에 요소를 끝에 추가하려면 list.append(요소)를 사용합니다.',
    cloze: { sentence: '리스트 끝에 요소를 추가하려면 list.___ (요소)를 사용합니다.', answers: ['append'] },
  },
];

const u4_2_questions: Question[] = [
  {
    id: 'u4_2q1', unit: 'u4_2', topic: '파일과 예외처리', level: 4,
    question: "파일을 읽기 모드로 여는 코드는?",
    options: [
      "open('file.txt', 'r')",
      "open('file.txt', 'w')",
      "open('file.txt', 'a')",
      "open('file.txt', 'x')",
    ],
    answer: 0,
    explanation: "open() 함수에서 'r'은 읽기(read) 모드, 'w'는 쓰기, 'a'는 추가 모드입니다.",
    cloze: { sentence: "파일 읽기 모드는 open('file.txt', '___ ')입니다.", answers: ['r'] },
  },
  {
    id: 'u4_2q2', unit: 'u4_2', topic: '파일과 예외처리', level: 4,
    question: 'try-except의 역할은?',
    options: [
      '코드 실행 속도 향상',
      '오류 발생 시 프로그램 멈춤 방지',
      '변수 자동 초기화',
      '메모리 해제',
        ],
    answer: 1,
    explanation: 'try-except는 오류(예외)가 발생했을 때 프로그램이 멈추지 않고 오류를 처리하고 계속 실행할 수 있게 합니다.',
    cloze: { sentence: 'try-except는 오류 발생 시 프로그램이 ___ 않도록 예외를 처리합니다.', answers: ['멈추지'] },
  },
  {
    id: 'u4_2q3', unit: 'u4_2', topic: '파일과 예외처리', level: 4,
    question: '`with open() as f:` 구문의 장점은?',
    options: [
      '파일을 더 빠르게 읽음',
      '암호화됨',
      '파일 자동으로 닫힘',
      '큰 파일만 처리 가능',
        ],
    answer: 2,
    explanation: 'with 구문을 사용하면 코드 블록이 끝날 때 파일이 자동으로 닫혀 파일 리소스 누수를 방지합니다.',
    cloze: { sentence: 'with open() as f: 구문은 코드 블록이 끝날 때 파일을 자동으로 ___ 합니다.', answers: ['닫'] },
  },
  {
    id: 'u4_2q4', unit: 'u4_2', topic: '파일과 예외처리', level: 4,
    question: 'ZeroDivisionError가 발생하는 상황은?',
    options: [
      '문자열 더할 때',
      '리스트 접근 시',
      '함수 호출 시',
      '0으로 나눌 때',
        ],
    answer: 3,
    explanation: 'ZeroDivisionError는 숫자를 0으로 나누려 할 때 발생합니다. 예: 10 / 0',
    cloze: { sentence: 'ZeroDivisionError는 숫자를 ___ 으로 나눌 때 발생합니다.', answers: ['0'] },
  },
];

const u4_3_questions: Question[] = [
  {
    id: 'u4_3q1', unit: 'u4_3', topic: 'NumPy 기초', level: 4,
    question: 'NumPy를 사용하는 주된 이유는?',
    options: [
      '빠른 수치 연산과 배열 처리',
      '웹 크롤링',
      '그래프 그리기',
      '데이터베이스 연결',
    ],
    answer: 0,
    explanation: 'NumPy는 C언어로 구현되어 Python보다 훨씬 빠른 수치 연산과 다차원 배열 처리를 제공합니다.',
    cloze: { sentence: 'NumPy는 빠른 ___ 연산과 배열 처리를 위해 사용합니다.', answers: ['수치'] },
  },
  {
    id: 'u4_3q2', unit: 'u4_3', topic: 'NumPy 기초', level: 4,
    question: '`import numpy as np`에서 `as np`의 의미는?',
    options: [
      'numpy 일부만 가져옴',
      'numpy를 np라는 별명으로 사용',
      '오류 방지',
      '버전 지정',
        ],
    answer: 1,
    explanation: 'as np는 numpy를 np라는 짧은 별명(alias)으로 사용하겠다는 의미입니다. np.array()처럼 사용합니다.',
    cloze: { sentence: 'import numpy as np에서 as np는 numpy를 ___ 라는 별명으로 사용한다는 의미입니다.', answers: ['np'] },
  },
  {
    id: 'u4_3q3', unit: 'u4_3', topic: 'NumPy 기초', level: 4,
    question: '`np.array([1,2,3]) * 2`의 결과는?',
    options: [
      '[1, 2, 3, 1, 2, 3]',
      '[3, 4, 5]',
      '[2, 4, 6]',
      '오류 발생',
        ],
    answer: 2,
    explanation: 'NumPy 배열에 숫자를 곱하면 배열의 각 요소에 그 숫자가 곱해집니다. 1*2=2, 2*2=4, 3*2=6.',
    cloze: { sentence: 'np.array([1,2,3]) * 2의 결과는 [___, 4, 6]입니다.', answers: ['2'] },
  },
  {
    id: 'u4_3q4', unit: 'u4_3', topic: 'NumPy 기초', level: 4,
    question: '`np.zeros((3,3))`의 결과는?',
    options: [
      '[0,0,0]',
      '빈 배열',
      '3개의 None',
      '3x3 크기의 0으로 채워진 배열',
        ],
    answer: 3,
    explanation: 'np.zeros((3,3))은 3행 3열, 총 9개의 요소가 모두 0인 2차원 배열을 생성합니다.',
    cloze: { sentence: 'np.zeros((3,3))은 3x3 크기의 모든 요소가 ___ 인 배열을 생성합니다.', answers: ['0'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 5 – 데이터 분석 입문 📊
// ─────────────────────────────────────────────
const u5_1_questions: Question[] = [
  {
    id: 'u5_1q1', unit: 'u5_1', topic: 'Pandas', level: 5,
    question: 'pandas DataFrame을 CSV 파일에서 읽는 코드는?',
    options: [
      "pd.read_csv('file.csv')",
      "pd.open('file.csv')",
      "pd.load('file.csv')",
      "pd.import('file.csv')",
    ],
    answer: 0,
    explanation: 'pandas에서 CSV 파일을 읽으려면 pd.read_csv() 함수를 사용합니다.',
    cloze: { sentence: "pandas에서 CSV 파일 읽기: pd.___ ('file.csv')", answers: ['read_csv'] },
  },
  {
    id: 'u5_1q2', unit: 'u5_1', topic: 'Pandas', level: 5,
    question: 'DataFrame에서 특정 열을 선택하는 방법은?',
    options: [
      "df.get('컬럼명')",
      "df['컬럼명']",
      'df->컬럼명',
      "df.select('컬럼명')",
        ],
    answer: 1,
    explanation: "DataFrame에서 특정 열은 df['컬럼명'] 또는 df.컬럼명으로 선택합니다.",
    cloze: { sentence: "DataFrame의 특정 열은 df['___']으로 선택합니다.", answers: ['컬럼명'] },
  },
  {
    id: 'u5_1q3', unit: 'u5_1', topic: 'Pandas', level: 5,
    question: "`df.groupby('category').mean()`의 의미는?",
    options: [
      '데이터 정렬',
      '중복 제거',
      'category별 평균값 계산',
      '필터링',
        ],
    answer: 2,
    explanation: "groupby('category').mean()은 category 열의 각 그룹별로 나머지 숫자 열들의 평균을 계산합니다.",
    cloze: { sentence: "groupby('category').mean()은 category별 ___ 을 계산합니다.", answers: ['평균값'] },
  },
  {
    id: 'u5_1q4', unit: 'u5_1', topic: 'Pandas', level: 5,
    question: '`df.isnull().sum()`의 역할은?',
    options: [
      '데이터 합계',
      '행 수 확인',
      '데이터 타입 확인',
      '각 열의 결측값 개수 확인',
        ],
    answer: 3,
    explanation: 'df.isnull()은 결측값(NaN)이 있으면 True를 반환하고, .sum()으로 각 열의 결측값 개수를 셉니다.',
    cloze: { sentence: 'df.isnull().sum()은 각 열의 ___ 개수를 확인합니다.', answers: ['결측값'] },
  },
];

const u5_2_questions: Question[] = [
  {
    id: 'u5_2q1', unit: 'u5_2', topic: '기초 통계', level: 5,
    question: '평균(mean)과 중앙값(median)이 크게 다를 때 의미하는 것은?',
    options: [
      '데이터에 극단값(이상치)이 있을 가능성',
      '데이터가 정확함',
      '샘플이 충분함',
      '분석 오류',
    ],
    answer: 0,
    explanation: '평균은 극단값에 민감하고 중앙값은 덜 민감합니다. 두 값이 크게 다르면 이상치가 있을 가능성이 높습니다.',
    cloze: { sentence: '평균과 중앙값이 크게 다르면 데이터에 ___ 이 있을 가능성이 높습니다.', answers: ['이상치'] },
  },
  {
    id: 'u5_2q2', unit: 'u5_2', topic: '기초 통계', level: 5,
    question: '표준편차(Standard Deviation)가 나타내는 것은?',
    options: [
      '데이터 최댓값',
      '데이터가 평균에서 얼마나 흩어져 있는지',
      '데이터 합계',
      '데이터 개수',
        ],
    answer: 1,
    explanation: '표준편차는 데이터가 평균값에서 얼마나 멀리 흩어져 있는지를 나타내는 통계 지표입니다.',
    cloze: { sentence: '표준편차는 데이터가 평균에서 얼마나 ___ 있는지를 나타냅니다.', answers: ['흩어져'] },
  },
  {
    id: 'u5_2q3', unit: 'u5_2', topic: '기초 통계', level: 5,
    question: '두 변수 간 상관계수가 -0.9라면?',
    options: [
      '관계없음',
      '강한 양의 상관관계',
      '강한 음의 상관관계 (한쪽 증가 시 다른쪽 감소)',
      '약한 음의 상관관계',
        ],
    answer: 2,
    explanation: '상관계수 -0.9는 강한 음의 상관관계를 의미합니다. 한 변수가 증가하면 다른 변수는 강하게 감소합니다.',
    cloze: { sentence: '상관계수 -0.9는 강한 ___ 상관관계를 의미합니다.', answers: ['음의'] },
  },
  {
    id: 'u5_2q4', unit: 'u5_2', topic: '기초 통계', level: 5,
    question: '`df.describe()`가 보여주는 정보는?',
    options: [
      '데이터 타입만',
      '결측값만',
      '상관관계만',
      '개수, 평균, 표준편차, 최솟값, 최댓값 등',
        ],
    answer: 3,
    explanation: 'df.describe()는 숫자형 열에 대해 개수, 평균, 표준편차, 사분위수, 최솟값, 최댓값 등 기본 통계를 보여줍니다.',
    cloze: { sentence: 'df.describe()는 개수, ___, 표준편차, 최솟값, 최댓값 등을 보여줍니다.', answers: ['평균'] },
  },
];

const u5_3_questions: Question[] = [
  {
    id: 'u5_3q1', unit: 'u5_3', topic: '데이터 시각화', level: 5,
    question: 'matplotlib에서 선 그래프를 그리는 함수는?',
    options: [
      'plt.plot()',
      'plt.bar()',
      'plt.scatter()',
      'plt.hist()',
    ],
    answer: 0,
    explanation: 'plt.plot()은 선 그래프(꺾은선 그래프)를 그리는 함수입니다. plt.bar()는 막대, plt.hist()는 히스토그램입니다.',
    cloze: { sentence: 'matplotlib에서 선 그래프는 plt.___ ()로 그립니다.', answers: ['plot'] },
  },
  {
    id: 'u5_3q2', unit: 'u5_3', topic: '데이터 시각화', level: 5,
    question: '히스토그램이 보여주는 것은?',
    options: [
      '두 변수의 관계',
      '데이터의 분포와 빈도',
      '시간에 따른 변화',
      '카테고리 비교',
        ],
    answer: 1,
    explanation: '히스토그램은 데이터 값을 구간으로 나누어 각 구간에 몇 개의 데이터가 있는지(빈도)를 막대로 보여줍니다.',
    cloze: { sentence: '히스토그램은 데이터의 ___ 와 빈도를 보여줍니다.', answers: ['분포'] },
  },
  {
    id: 'u5_3q3', unit: 'u5_3', topic: '데이터 시각화', level: 5,
    question: '산점도(Scatter Plot)가 적합한 상황은?',
    options: [
      '전체 비율 표시',
      '시계열 트렌드',
      '두 변수 간 관계 파악',
      '그룹 비교',
        ],
    answer: 2,
    explanation: '산점도는 두 변수의 값을 x, y 좌표로 점을 찍어 두 변수 간의 관계(상관관계)를 파악하는 데 적합합니다.',
    cloze: { sentence: '산점도는 두 변수 간의 ___ 를 파악하는 데 적합합니다.', answers: ['관계'] },
  },
  {
    id: 'u5_3q4', unit: 'u5_3', topic: '데이터 시각화', level: 5,
    question: '시각화에서 레이블과 제목이 중요한 이유는?',
    options: [
      '그래프 크기를 키우기 위해',
      '색상을 추가하기 위해',
      '성능 향상',
      '보는 사람이 그래프를 이해할 수 있도록',
        ],
    answer: 3,
    explanation: '레이블(축 이름)과 제목은 그래프를 보는 사람이 데이터의 의미를 올바르게 이해할 수 있도록 돕습니다.',
    cloze: { sentence: '레이블과 제목은 보는 사람이 그래프를 ___ 할 수 있도록 돕습니다.', answers: ['이해'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 6 – 알고리즘 적용 ⚙️
// ─────────────────────────────────────────────
const u6_1_questions: Question[] = [
  {
    id: 'u6_1q1', unit: 'u6_1', topic: '분류 알고리즘', level: 6,
    question: '로지스틱 회귀(Logistic Regression)의 출력값은?',
    options: [
      '0과 1 사이의 확률값',
      '연속적인 수치',
      '클러스터 번호',
      '트리 구조',
    ],
    answer: 0,
    explanation: '로지스틱 회귀는 시그모이드 함수를 사용하여 0과 1 사이의 확률값을 출력합니다. 이진 분류에 주로 사용됩니다.',
    cloze: { sentence: '로지스틱 회귀는 0과 1 사이의 ___ 값을 출력합니다.', answers: ['확률'] },
  },
  {
    id: 'u6_1q2', unit: 'u6_1', topic: '분류 알고리즘', level: 6,
    question: '결정트리(Decision Tree)의 특징은?',
    options: [
      '항상 최고 성능',
      '특징 기반 분기로 예측, 해석이 쉬움',
      '과적합 없음',
      '대용량 데이터 전용',
        ],
    answer: 1,
    explanation: '결정트리는 데이터의 특징을 기반으로 분기를 반복하여 예측하며, 규칙이 명확하여 결과 해석이 쉽습니다.',
    cloze: { sentence: '결정트리는 특징 기반 ___ 로 예측하며 해석이 쉽습니다.', answers: ['분기'] },
  },
  {
    id: 'u6_1q3', unit: 'u6_1', topic: '분류 알고리즘', level: 6,
    question: 'K-최근접 이웃(KNN)에서 K의 의미는?',
    options: [
      '학습률',
      '반복 횟수',
      '예측에 사용할 가장 가까운 이웃의 수',
      '레이어 수',
        ],
    answer: 2,
    explanation: 'KNN에서 K는 새로운 데이터를 분류할 때 참고할 가장 가까운 이웃 데이터 포인트의 수입니다.',
    cloze: { sentence: 'KNN에서 K는 가장 가까운 ___ 의 수입니다.', answers: ['이웃'] },
  },
  {
    id: 'u6_1q4', unit: 'u6_1', topic: '분류 알고리즘', level: 6,
    question: '분류 모델 성능 지표 중 정밀도(Precision)의 의미는?',
    options: [
      '전체 중 정답 비율',
      '음성 중 정답 비율',
      '재현율과 정밀도 평균',
      '양성 예측 중 실제 양성 비율',
        ],
    answer: 3,
    explanation: '정밀도(Precision)는 모델이 양성으로 예측한 것 중 실제로 양성인 비율입니다. TP / (TP + FP)',
    cloze: { sentence: '정밀도(Precision)는 양성 예측 중 실제 양성 ___ 입니다.', answers: ['비율'] },
  },
];

const u6_2_questions: Question[] = [
  {
    id: 'u6_2q1', unit: 'u6_2', topic: '회귀와 군집화', level: 6,
    question: '선형 회귀의 목적은?',
    options: [
      '입력과 출력 간의 선형 관계 학습',
      '데이터 분류',
      '클러스터 형성',
      '이상치 탐지',
    ],
    answer: 0,
    explanation: '선형 회귀는 입력 변수와 출력 변수 사이의 선형적인 관계를 학습하여 수치를 예측합니다.',
    cloze: { sentence: '선형 회귀는 입력과 출력 간의 ___ 관계를 학습하여 수치를 예측합니다.', answers: ['선형'] },
  },
  {
    id: 'u6_2q2', unit: 'u6_2', topic: '회귀와 군집화', level: 6,
    question: 'K-means 군집화에서 K는 무엇인가요?',
    options: [
      '반복 횟수',
      '사전에 정하는 군집(클러스터) 수',
      '최근접 이웃 수',
      '특성 수',
        ],
    answer: 1,
    explanation: 'K-means에서 K는 데이터를 몇 개의 군집으로 나눌지 사전에 지정하는 클러스터의 수입니다.',
    cloze: { sentence: 'K-means에서 K는 사전에 정하는 ___ 수입니다.', answers: ['클러스터'] },
  },
  {
    id: 'u6_2q3', unit: 'u6_2', topic: '회귀와 군집화', level: 6,
    question: '회귀 모델 평가에 사용되는 MAE(평균 절대 오차)의 특징은?',
    options: [
      '분류 정확도',
      '모델 크기',
      '예측값과 실제값 차이의 절대값 평균',
      '학습 속도',
        ],
    answer: 2,
    explanation: 'MAE는 예측값과 실제값 차이의 절대값 평균으로, 직관적이고 이상치에 덜 민감한 회귀 평가 지표입니다.',
    cloze: { sentence: 'MAE는 예측값과 실제값 차이의 ___ 값 평균입니다.', answers: ['절대'] },
  },
  {
    id: 'u6_2q4', unit: 'u6_2', topic: '회귀와 군집화', level: 6,
    question: '비지도학습인 군집화의 주요 활용 사례는?',
    options: [
      '스팸 메일 필터링',
      '가격 예측',
      '이미지 분류',
      '고객 세그먼트 분류',
        ],
    answer: 3,
    explanation: '군집화는 레이블 없이 비슷한 고객을 그룹으로 묶어 마케팅 전략 수립 등에 활용됩니다.',
    cloze: { sentence: '군집화는 비슷한 고객을 그룹으로 묶어 ___ 분류에 활용됩니다.', answers: ['고객 세그먼트'] },
  },
];

const u6_3_questions: Question[] = [
  {
    id: 'u6_3q1', unit: 'u6_3', topic: 'scikit-learn', level: 6,
    question: 'scikit-learn에서 모델 학습하는 메서드는?',
    options: [
      'model.fit(X_train, y_train)',
      'model.learn()',
      'model.train()',
      'model.run()',
    ],
    answer: 0,
    explanation: 'scikit-learn에서 모델 학습은 model.fit(X_train, y_train)으로 수행합니다. X_train은 특성, y_train은 정답입니다.',
    cloze: { sentence: 'scikit-learn에서 모델 학습: model.___ (X_train, y_train)', answers: ['fit'] },
  },
  {
    id: 'u6_3q2', unit: 'u6_3', topic: 'scikit-learn', level: 6,
    question: '`train_test_split`의 역할은?',
    options: [
      '데이터 정규화',
      '데이터를 훈련셋과 테스트셋으로 분리',
      '특성 선택',
      '모델 평가',
        ],
    answer: 1,
    explanation: 'train_test_split은 전체 데이터를 훈련셋과 테스트셋으로 랜덤하게 분리하는 scikit-learn 함수입니다.',
    cloze: { sentence: 'train_test_split은 데이터를 훈련셋과 ___ 으로 분리합니다.', answers: ['테스트셋'] },
  },
  {
    id: 'u6_3q3', unit: 'u6_3', topic: 'scikit-learn', level: 6,
    question: '`StandardScaler`를 사용하는 이유는?',
    options: [
      '데이터 증강',
      '레이블 인코딩',
      '특성 값의 스케일을 통일하여 학습 안정화',
      '차원 축소',
        ],
    answer: 2,
    explanation: 'StandardScaler는 특성의 평균을 0, 표준편차를 1로 변환하여 스케일을 통일하고 모델 학습을 안정화합니다.',
    cloze: { sentence: 'StandardScaler는 특성 값의 ___ 을 통일하여 학습을 안정화합니다.', answers: ['스케일'] },
  },
  {
    id: 'u6_3q4', unit: 'u6_3', topic: 'scikit-learn', level: 6,
    question: '`model.predict(X_test)`의 결과는?',
    options: [
      '모델 정확도',
      '학습 손실값',
      '특성 중요도',
      '테스트 데이터에 대한 모델의 예측값',
        ],
    answer: 3,
    explanation: 'model.predict(X_test)는 학습된 모델을 사용하여 테스트 데이터에 대한 예측값을 반환합니다.',
    cloze: { sentence: 'model.predict(X_test)는 테스트 데이터에 대한 ___ 값을 반환합니다.', answers: ['예측'] },
  },
];

// ─────────────────────────────────────────────
// LEVEL 7 – 코드 마스터 🔥
// ─────────────────────────────────────────────
const u7_1_questions: Question[] = [
  {
    id: 'u7_1q1', unit: 'u7_1', topic: '디버깅', level: 7,
    question: "`TypeError: unsupported operand type(s) for +: 'int' and 'str'`의 원인은?",
    options: [
      '정수와 문자열을 더하려 했기 때문',
      '변수가 없어서',
      '함수 오류',
      '메모리 부족',
    ],
    answer: 0,
    explanation: "Python에서 정수(int)와 문자열(str)을 + 연산자로 더할 수 없습니다. 예: 1 + '2'는 TypeError를 발생시킵니다.",
    cloze: { sentence: 'TypeError는 ___ 와 문자열을 더하려 했기 때문에 발생합니다.', answers: ['정수'] },
  },
  {
    id: 'u7_1q2', unit: 'u7_1', topic: '디버깅', level: 7,
    question: '`IndexError: list index out of range`가 발생하는 상황은?',
    options: [
      '딕셔너리 키 오류',
      '리스트 범위를 벗어난 인덱스 접근',
      '타입 불일치',
      '문법 오류',
        ],
    answer: 1,
    explanation: 'IndexError는 존재하지 않는 인덱스로 리스트에 접근할 때 발생합니다. 예: [1,2,3][5]',
    cloze: { sentence: 'IndexError는 리스트 ___ 를 벗어난 인덱스로 접근할 때 발생합니다.', answers: ['범위'] },
  },
  {
    id: 'u7_1q3', unit: 'u7_1', topic: '디버깅', level: 7,
    question: '디버깅에서 `print()`를 활용하는 전략은?',
    options: [
      '코드 삭제',
      '주석 처리',
      '중간 변수값을 출력해 흐름 확인',
      '재시작',
        ],
    answer: 2,
    explanation: 'print()로 코드 중간에 변수값을 출력하면 코드가 어디서 어떻게 작동하는지 흐름을 파악할 수 있습니다.',
    cloze: { sentence: '디버깅에서 print()로 중간 ___ 값을 출력하여 코드 흐름을 확인합니다.', answers: ['변수'] },
  },
  {
    id: 'u7_1q4', unit: 'u7_1', topic: '디버깅', level: 7,
    question: '`try-except`로 잡을 수 없는 오류 유형은?',
    options: [
      'ValueError',
      'KeyError',
      'ZeroDivisionError',
      'SyntaxError(문법 오류)',
        ],
    answer: 3,
    explanation: 'SyntaxError는 코드가 실행되기 전에 발생하는 문법 오류로, try-except로 잡을 수 없습니다.',
    cloze: { sentence: 'try-except로 잡을 수 없는 오류는 ___ 입니다.', answers: ['SyntaxError'] },
  },
];

const u7_2_questions: Question[] = [
  {
    id: 'u7_2q1', unit: 'u7_2', topic: '코드 최적화', level: 7,
    question: '리스트 컴프리헨션이 일반 for 반복문보다 빠른 이유는?',
    options: [
      '파이썬 내부 최적화가 적용됨',
      '코드가 짧아서',
      '변수를 덜 써서',
      '자동으로 병렬 처리',
    ],
    answer: 0,
    explanation: '리스트 컴프리헨션은 Python 인터프리터 내부에서 최적화된 방식으로 처리되어 일반 for 루프보다 빠릅니다.',
    cloze: { sentence: '리스트 컴프리헨션은 Python 내부 ___ 가 적용되어 for 루프보다 빠릅니다.', answers: ['최적화'] },
  },
  {
    id: 'u7_2q2', unit: 'u7_2', topic: '코드 최적화', level: 7,
    question: '시간복잡도 O(n²)인 알고리즘의 문제점은?',
    options: [
      '메모리를 많이 씀',
      '데이터가 2배 늘면 처리 시간이 4배 증가',
      '오류 가능성 높음',
      '구현이 복잡함',
        ],
    answer: 1,
    explanation: 'O(n²)는 데이터 크기 n이 2배가 되면 처리 시간이 4배(2²)로 늘어나는 비효율적인 알고리즘입니다.',
    cloze: { sentence: 'O(n²) 알고리즘은 데이터가 2배 늘면 처리 시간이 ___ 배 증가합니다.', answers: ['4'] },
  },
  {
    id: 'u7_2q3', unit: 'u7_2', topic: '코드 최적화', level: 7,
    question: '제너레이터(Generator)를 사용하는 이점은?',
    options: [
      '코드 속도 무조건 향상',
      '병렬 처리 자동화',
      '모든 데이터를 메모리에 올리지 않고 순차 처리',
      '타입 체크',
        ],
    answer: 2,
    explanation: '제너레이터는 데이터를 한 번에 모두 메모리에 올리지 않고 필요할 때마다 하나씩 생성하여 메모리를 절약합니다.',
    cloze: { sentence: '제너레이터는 데이터를 ___ 에 모두 올리지 않고 순차적으로 처리합니다.', answers: ['메모리'] },
  },
  {
    id: 'u7_2q4', unit: 'u7_2', topic: '코드 최적화', level: 7,
    question: 'pandas에서 `.apply()` 대신 벡터 연산을 선호하는 이유는?',
    options: [
      '코드가 짧아서',
      '오류가 없어서',
      '호환성 때문',
      'NumPy 기반 연산이 훨씬 빠르기 때문',
        ],
    answer: 3,
    explanation: 'pandas의 벡터 연산은 NumPy 기반으로 C로 최적화되어 있어 Python 루프인 .apply()보다 훨씬 빠릅니다.',
    cloze: { sentence: 'pandas 벡터 연산은 ___ 기반으로 최적화되어 .apply()보다 훨씬 빠릅니다.', answers: ['NumPy'] },
  },
];

const u7_3_questions: Question[] = [
  {
    id: 'u7_3q1', unit: 'u7_3', topic: 'AI 프로젝트', level: 7,
    question: 'AI 프로젝트에서 가장 먼저 해야 할 것은?',
    options: [
      '해결할 문제와 목표 명확히 정의',
      '모델 선택',
      '코드 작성',
      '데이터 수집',
    ],
    answer: 0,
    explanation: 'AI 프로젝트는 무엇을 해결할 것인지 문제와 목표를 명확히 정의하는 것이 가장 중요한 첫 단계입니다.',
    cloze: { sentence: 'AI 프로젝트의 첫 단계는 해결할 ___ 와 목표를 명확히 정의하는 것입니다.', answers: ['문제'] },
  },
  {
    id: 'u7_3q2', unit: 'u7_3', topic: 'AI 프로젝트', level: 7,
    question: '데이터 전처리에서 이상치(Outlier) 처리가 중요한 이유는?',
    options: [
      '데이터 크기를 줄이기 위해',
      '모델 성능에 큰 영향을 미치기 때문',
      '속도 향상',
      '법적 요건',
        ],
    answer: 1,
    explanation: '이상치는 모델의 학습을 왜곡하여 성능을 크게 저하시킬 수 있으므로 적절히 처리해야 합니다.',
    cloze: { sentence: '이상치는 모델 ___ 에 큰 영향을 미치므로 전처리에서 처리해야 합니다.', answers: ['성능'] },
  },
  {
    id: 'u7_3q3', unit: 'u7_3', topic: 'AI 프로젝트', level: 7,
    question: '모델을 실제 서비스에 배포(Deploy)할 때 중요한 고려사항은?',
    options: [
      '가장 복잡한 모델 선택',
      '최대 정확도만 추구',
      '안정성, 응답 속도, 유지보수 계획',
      '오프라인 전용 운영',
        ],
    answer: 2,
    explanation: '실제 서비스 배포 시에는 모델 정확도뿐 아니라 안정성, 빠른 응답 속도, 장기 유지보수 계획도 중요합니다.',
    cloze: { sentence: '모델 배포 시 안정성, ___, 유지보수 계획을 고려해야 합니다.', answers: ['응답 속도'] },
  },
  {
    id: 'u7_3q4', unit: 'u7_3', topic: 'AI 프로젝트', level: 7,
    question: 'AI 모델 성능이 실제 환경에서 낮아지는 이유는?',
    options: [
      '서버 성능 부족',
      '코드 버그',
      '네트워크 오류',
      '실제 데이터가 훈련 데이터와 다름(데이터 드리프트)',
        ],
    answer: 3,
    explanation: '데이터 드리프트는 시간이 지남에 따라 실제 입력 데이터의 분포가 훈련 데이터와 달라지는 현상으로 모델 성능을 저하시킵니다.',
    cloze: { sentence: '실제 환경에서 모델 성능이 낮아지는 주된 이유는 ___ 드리프트입니다.', answers: ['데이터'] },
  },
];

// ─────────────────────────────────────────────
// UNITS array
// ─────────────────────────────────────────────
export const UNITS: Unit[] = [
  // Level 0
  { id: 'u0_1', title: 'AI란 무엇인가?', icon: '🤖', level: 0, questions: u0_1_questions },
  { id: 'u0_2', title: 'AI는 어떻게 배울까?', icon: '🧠', level: 0, questions: u0_2_questions },
  { id: 'u0_3', title: 'AI와 우리 생활', icon: '🌍', level: 0, questions: u0_3_questions },
  { id: 'u0_4', title: '바보로봇 코딩', icon: '🤖', level: 0, unitType: 'baboRobot', questions: [] },
  // Level 1
  { id: 'u1_1', title: 'AI 핵심 용어', icon: '📚', level: 1, questions: u1_1_questions },
  { id: 'u1_2', title: 'AI 도구들', icon: '🛠️', level: 1, questions: u1_2_questions },
  { id: 'u1_3', title: '데이터의 세계', icon: '📦', level: 1, questions: u1_3_questions },
  // Level 2
  { id: 'u2_1', title: '머신러닝 종류', icon: '🔀', level: 2, questions: u2_1_questions },
  { id: 'u2_2', title: '신경망과 딥러닝', icon: '🕸️', level: 2, questions: u2_2_questions },
  { id: 'u2_3', title: 'AI 모델 학습', icon: '🎯', level: 2, questions: u2_3_questions },
  // Level 3
  { id: 'u3_1', title: 'Python 시작하기', icon: '🐍', level: 3, questions: u3_1_questions },
  { id: 'u3_2', title: '조건문과 반복문', icon: '🔁', level: 3, questions: u3_2_questions },
  { id: 'u3_3', title: '함수와 모듈', icon: '📦', level: 3, questions: u3_3_questions },
  // Level 4
  { id: 'u4_1', title: '리스트와 딕셔너리', icon: '📋', level: 4, questions: u4_1_questions },
  { id: 'u4_2', title: '파일과 예외처리', icon: '🗂️', level: 4, questions: u4_2_questions },
  { id: 'u4_3', title: 'NumPy 기초', icon: '🔢', level: 4, questions: u4_3_questions },
  // Level 5
  { id: 'u5_1', title: 'Pandas 기초', icon: '🐼', level: 5, questions: u5_1_questions },
  { id: 'u5_2', title: '기초 통계 분석', icon: '📈', level: 5, questions: u5_2_questions },
  { id: 'u5_3', title: '데이터 시각화', icon: '📉', level: 5, questions: u5_3_questions },
  // Level 6
  { id: 'u6_1', title: '분류 알고리즘', icon: '🏷️', level: 6, questions: u6_1_questions },
  { id: 'u6_2', title: '회귀와 군집화', icon: '📐', level: 6, questions: u6_2_questions },
  { id: 'u6_3', title: 'scikit-learn 활용', icon: '🔬', level: 6, questions: u6_3_questions },
  // Level 7
  { id: 'u7_1', title: '코드 읽기와 디버깅', icon: '🔍', level: 7, questions: u7_1_questions },
  { id: 'u7_2', title: '코드 최적화', icon: '⚡', level: 7, questions: u7_2_questions },
  { id: 'u7_3', title: 'AI 프로젝트 설계', icon: '🏗️', level: 7, questions: u7_3_questions },
];

// ─────────────────────────────────────────────
// DIAGNOSTIC QUESTIONS – 12 questions (covering all levels)
// Score mapping: 0-1→0, 2-3→1, 4-5→2, 6-7→3, 8-9→4, 10→5, 11→6, 12→7
// ─────────────────────────────────────────────
export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'dq1', unit: 'diagnostic', topic: 'AI 활용', level: 0,
    question: 'AI가 일상에서 사용되는 예시는?',
    options: [
      '스마트폰 음성 비서',
      '종이책',
      '자전거',
      'TV 리모컨',
    ],
    answer: 0,
    explanation: '스마트폰의 음성 비서(예: 시리, 빅스비)는 AI를 활용한 대표적인 일상 예시입니다.',
    cloze: { sentence: 'AI를 활용한 일상 예시로 스마트폰 ___ 가 있습니다.', answers: ['음성 비서'] },
  },
  {
    id: 'dq2', unit: 'diagnostic', topic: 'AI 학습', level: 0,
    question: '머신러닝에서 AI는 어떻게 학습하나요?',
    options: [
      '사람이 규칙 입력',
      '데이터를 보고 패턴을 찾아서',
      '인터넷 검색',
      '책 읽기',
        ],
    answer: 1,
    explanation: '머신러닝에서 AI는 대량의 데이터를 분석하여 스스로 패턴을 발견하고 학습합니다.',
    cloze: { sentence: '머신러닝 AI는 ___ 를 보고 패턴을 찾아 학습합니다.', answers: ['데이터'] },
  },
  {
    id: 'dq3', unit: 'diagnostic', topic: 'AI 용어', level: 1,
    question: "'딥러닝'이 일반 머신러닝과 다른 핵심 특징은?",
    options: [
      '더 적은 데이터',
      '빠른 학습',
      '인간 뇌의 신경망 구조 모방',
      '수동 규칙',
        ],
    answer: 2,
    explanation: '딥러닝은 인간 뇌의 신경망 구조를 모방한 다층 신경망을 사용하는 것이 핵심 특징입니다.',
    cloze: { sentence: '딥러닝은 인간 뇌의 ___ 구조를 모방한 다층 신경망을 사용합니다.', answers: ['신경망'] },
  },
  {
    id: 'dq4', unit: 'diagnostic', topic: '데이터', level: 1,
    question: '데이터가 편향되면 AI는 어떻게 되나요?',
    options: [
      '더 정확해짐',
      '학습 거부',
      '자동 수정',
      '편향된 결과 출력',
        ],
    answer: 3,
    explanation: 'AI는 편향된 데이터를 그대로 학습하므로 편향된 결과를 출력하게 됩니다.',
    cloze: { sentence: '편향된 데이터로 학습한 AI는 ___ 된 결과를 출력합니다.', answers: ['편향'] },
  },
  {
    id: 'dq5', unit: 'diagnostic', topic: '머신러닝', level: 2,
    question: '지도학습의 핵심 특징은?',
    options: [
      '정답 레이블이 있는 데이터로 학습',
      '정답 없이 패턴 발견',
      '보상으로 학습',
      '규칙 직접 입력',
    ],
    answer: 0,
    explanation: '지도학습은 입력 데이터와 정답(레이블)이 쌍을 이루는 데이터로 모델을 학습시킵니다.',
    cloze: { sentence: '지도학습은 정답 ___ 이 있는 데이터로 학습합니다.', answers: ['레이블'] },
  },
  {
    id: 'dq6', unit: 'diagnostic', topic: 'AI 모델', level: 2,
    question: '과적합(Overfitting)이란?',
    options: [
      '학습이 느린 것',
      '훈련 데이터만 외워 새 데이터에 성능 낮아짐',
      '데이터 부족',
      '모델이 단순함',
        ],
    answer: 1,
    explanation: '과적합은 모델이 훈련 데이터를 너무 세밀하게 학습하여 새로운 데이터에서 성능이 떨어지는 현상입니다.',
    cloze: { sentence: '과적합은 훈련 데이터만 ___ 여 새 데이터에서 성능이 낮아지는 현상입니다.', answers: ['외워'] },
  },
  {
    id: 'dq7', unit: 'diagnostic', topic: 'Python', level: 3,
    question: 'Python에서 화면에 출력하는 함수는?',
    options: [
      'show()',
      'display()',
      'print()',
      'output()',
        ],
    answer: 2,
    explanation: 'Python에서 화면에 내용을 출력하려면 print() 함수를 사용합니다.',
    cloze: { sentence: 'Python에서 화면 출력 함수는 ___ ()입니다.', answers: ['print'] },
  },
  {
    id: 'dq8', unit: 'diagnostic', topic: 'Python', level: 3,
    question: '`for i in range(3): print(i)`의 출력은?',
    options: [
      '1, 2, 3',
      '0, 1, 2, 3',
      '3, 3, 3',
      '0, 1, 2',
        ],
    answer: 3,
    explanation: 'range(3)은 0, 1, 2를 순서대로 생성하므로 0, 1, 2가 출력됩니다.',
    cloze: { sentence: 'range(3)은 ___, 1, 2를 순서대로 생성합니다.', answers: ['0'] },
  },
  {
    id: 'dq9', unit: 'diagnostic', topic: 'Python 활용', level: 4,
    question: '`[x**2 for x in range(4)]`의 결과는?',
    options: [
      '[0, 1, 4, 9]',
      '[0, 2, 4, 6]',
      '[1, 4, 9, 16]',
      '[0, 1, 2, 3]',
    ],
    answer: 0,
    explanation: 'range(4)는 0,1,2,3을 생성하고 각각 제곱하면 0²=0, 1²=1, 2²=4, 3²=9가 됩니다.',
    cloze: { sentence: '[x**2 for x in range(4)]의 결과는 [0, 1, ___, 9]입니다.', answers: ['4'] },
  },
  {
    id: 'dq10', unit: 'diagnostic', topic: 'Pandas', level: 5,
    question: "`df.groupby('category').mean()`의 의미는?",
    options: [
      '데이터 정렬',
      '카테고리별 평균값 계산',
      '중복 제거',
      '필터링',
        ],
    answer: 1,
    explanation: "groupby('category').mean()은 category 열의 각 그룹별 숫자 열의 평균을 계산합니다.",
    cloze: { sentence: "groupby('category').mean()은 카테고리별 ___ 값을 계산합니다.", answers: ['평균'] },
  },
  {
    id: 'dq11', unit: 'diagnostic', topic: 'scikit-learn', level: 6,
    question: 'scikit-learn에서 모델 학습 메서드는?',
    options: [
      'model.learn()',
      'model.train()',
      'model.fit(X_train, y_train)',
      'model.run()',
        ],
    answer: 2,
    explanation: 'scikit-learn에서 모델 학습은 model.fit(X_train, y_train)으로 수행합니다.',
    cloze: { sentence: 'scikit-learn 모델 학습: model.___ (X_train, y_train)', answers: ['fit'] },
  },
  {
    id: 'dq12', unit: 'diagnostic', topic: '디버깅', level: 7,
    question: "`TypeError: unsupported operand type(s) for +: 'int' and 'str'`의 원인은?",
    options: [
      '변수 없음',
      '함수 오류',
      '메모리 부족',
      '정수와 문자열을 더하려 했기 때문',
        ],
    answer: 3,
    explanation: 'Python에서 정수(int)와 문자열(str)은 + 연산자로 더할 수 없어 TypeError가 발생합니다.',
    cloze: { sentence: 'TypeError는 ___ 와 문자열을 더하려 했기 때문에 발생합니다.', answers: ['정수'] },
  },
];
