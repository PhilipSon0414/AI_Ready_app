export type Question = {
  id: string;
  unit: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Unit = {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
};

export const UNITS: Unit[] = [
  {
    id: 'u1',
    title: 'AI 기초 개념',
    icon: '🤖',
    description: '인공지능의 기본 개념과 역사',
    questions: [
      {
        id: 'q1',
        unit: 'u1',
        topic: 'AI 기초',
        question: '머신러닝에서 지도학습(Supervised Learning)이란 무엇인가?',
        options: [
          '레이블이 없는 데이터로 패턴을 찾는 학습',
          '레이블이 있는 데이터로 입력-출력 관계를 학습',
          '보상 신호를 통해 행동을 최적화하는 학습',
          '사람의 피드백 없이 스스로 학습하는 방식',
        ],
        answer: 1,
        explanation: '지도학습은 입력 데이터와 정답(레이블)이 함께 제공된 학습 데이터로 모델을 훈련하는 방식입니다.',
      },
      {
        id: 'q2',
        unit: 'u1',
        topic: 'AI 기초',
        question: '딥러닝(Deep Learning)과 머신러닝(Machine Learning)의 주요 차이점은?',
        options: [
          '딥러닝은 규칙 기반, 머신러닝은 데이터 기반',
          '딥러닝은 특징 추출 자동화, 머신러닝은 수동 특징 추출',
          '딥러닝은 소량 데이터에 강점, 머신러닝은 대량 데이터 필요',
          '딥러닝은 구조화 데이터, 머신러닝은 비구조화 데이터 처리',
        ],
        answer: 1,
        explanation: '딥러닝은 다층 신경망을 통해 특징을 자동으로 추출하지만, 일반 머신러닝은 사람이 특징을 직접 설계해야 합니다.',
      },
      {
        id: 'q3',
        unit: 'u1',
        topic: 'AI 기초',
        question: '과적합(Overfitting)을 방지하는 방법이 아닌 것은?',
        options: [
          '드롭아웃(Dropout) 적용',
          '정규화(Regularization) 사용',
          '학습률(Learning Rate) 증가',
          '데이터 증강(Data Augmentation)',
        ],
        answer: 2,
        explanation: '학습률 증가는 과적합 방지와 직접적인 관련이 없으며, 오히려 학습을 불안정하게 만들 수 있습니다.',
      },
    ],
  },
  {
    id: 'u2',
    title: 'LLM & 프롬프트',
    icon: '💬',
    description: '대형 언어 모델과 프롬프트 엔지니어링',
    questions: [
      {
        id: 'q4',
        unit: 'u2',
        topic: 'LLM',
        question: 'LLM에서 Transformer의 핵심 메커니즘은?',
        options: [
          '합성곱 연산(Convolution)',
          '순환 연결(Recurrent Connection)',
          '자기 주의 메커니즘(Self-Attention)',
          '마르코프 체인(Markov Chain)',
        ],
        answer: 2,
        explanation: 'Transformer는 Self-Attention 메커니즘을 사용하여 시퀀스 내 모든 위치 간의 관계를 병렬로 처리합니다.',
      },
      {
        id: 'q5',
        unit: 'u2',
        topic: '프롬프트',
        question: 'Few-shot prompting이란?',
        options: [
          '모델에게 예시 없이 지시만 주는 방식',
          '몇 가지 예시를 프롬프트에 포함하여 모델을 안내하는 방식',
          '파인튜닝을 통해 소량의 데이터로 학습하는 방식',
          '짧은 프롬프트로 빠른 응답을 유도하는 방식',
        ],
        answer: 1,
        explanation: 'Few-shot prompting은 프롬프트에 몇 가지 입출력 예시를 포함하여 모델이 원하는 형식/패턴으로 응답하도록 유도하는 기법입니다.',
      },
      {
        id: 'q6',
        unit: 'u2',
        topic: 'LLM',
        question: 'RAG(Retrieval-Augmented Generation)의 주요 목적은?',
        options: [
          '모델 추론 속도를 높이기 위해',
          '외부 지식을 검색하여 생성 정확도를 높이기 위해',
          '더 많은 파라미터로 모델을 확장하기 위해',
          '강화학습으로 모델을 미세조정하기 위해',
        ],
        answer: 1,
        explanation: 'RAG는 외부 데이터베이스에서 관련 정보를 검색하고 이를 컨텍스트로 활용하여 LLM의 응답 정확도와 최신성을 높입니다.',
      },
    ],
  },
  {
    id: 'u3',
    title: 'AI 윤리와 안전',
    icon: '⚖️',
    description: 'AI 편향, 공정성, 책임있는 AI',
    questions: [
      {
        id: 'q7',
        unit: 'u3',
        topic: 'AI 윤리',
        question: 'AI 모델의 할루시네이션(Hallucination)이란?',
        options: [
          '모델이 훈련 데이터를 외우는 현상',
          '모델이 사실과 다른 정보를 사실처럼 생성하는 현상',
          '모델이 응답을 거부하는 현상',
          '모델이 이미지를 텍스트로 변환하는 기능',
        ],
        answer: 1,
        explanation: '할루시네이션은 AI 모델이 실제로는 존재하지 않거나 잘못된 정보를 자신있게 사실처럼 생성하는 현상입니다.',
      },
      {
        id: 'q8',
        unit: 'u3',
        topic: 'AI 안전',
        question: 'RLHF(Reinforcement Learning from Human Feedback)의 주요 목적은?',
        options: [
          '학습 속도를 높이기 위해',
          '인간의 가치와 선호에 맞게 AI 행동을 정렬하기 위해',
          '파라미터 수를 줄이기 위해',
          '다국어 처리 능력을 향상시키기 위해',
        ],
        answer: 1,
        explanation: 'RLHF는 인간 피드백을 보상 신호로 활용해 모델의 출력을 인간의 의도와 가치에 맞게 조정하는 AI 정렬 기법입니다.',
      },
    ],
  },
  {
    id: 'u4',
    title: '생성형 AI 활용',
    icon: '🎨',
    description: 'Image, Audio, Code 생성 AI',
    questions: [
      {
        id: 'q9',
        unit: 'u4',
        topic: '생성형 AI',
        question: 'Stable Diffusion에서 사용되는 핵심 기술은?',
        options: [
          'GAN (Generative Adversarial Network)',
          'Diffusion Model (확산 모델)',
          'VAE (Variational Autoencoder)',
          'Transformer Decoder',
        ],
        answer: 1,
        explanation: 'Stable Diffusion은 확산 모델(Diffusion Model)을 기반으로 하며, 노이즈에서 점진적으로 이미지를 생성합니다.',
      },
      {
        id: 'q10',
        unit: 'u4',
        topic: '생성형 AI',
        question: 'GitHub Copilot이 기반하는 주요 기술은?',
        options: [
          'BERT',
          'GPT 계열 코드 모델 (Codex)',
          'T5',
          'AlphaCode',
        ],
        answer: 1,
        explanation: 'GitHub Copilot은 OpenAI의 Codex(GPT 기반 코드 특화 모델)를 기반으로 코드 자동완성 기능을 제공합니다.',
      },
    ],
  },
];
