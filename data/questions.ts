export type Question = {
  id: string;
  unit: string;
  topic: string;
  question: string;
  options: string[];
  answer: number; // 0-indexed
  explanation: string;
  level: 1 | 2 | 3 | 4;
};

export type Unit = {
  id: string;
  title: string;
  icon: string;
  description: string;
  level: 1 | 2 | 3 | 4;
  questions: Question[];
};

// ─────────────────────────────────────────────
// LEVEL 1 – AI 입문 (🌱)
// ─────────────────────────────────────────────
const u1_questions: Question[] = [
  {
    id: 'u1q1', unit: 'u1', topic: 'AI 기초', level: 1,
    question: '인공지능(AI)이란 무엇인가?',
    options: [
      '계산만 빠르게 하는 컴퓨터 프로그램',
      '사람처럼 학습·추론·문제 해결을 할 수 있는 컴퓨터 시스템',
      '로봇을 만드는 하드웨어 기술',
      '인터넷 검색 엔진',
    ],
    answer: 1,
    explanation: 'AI는 사람의 지능적 행동(학습, 추론, 문제 해결)을 컴퓨터 시스템이 수행할 수 있도록 하는 기술입니다.',
  },
  {
    id: 'u1q2', unit: 'u1', topic: 'AI 기초', level: 1,
    question: '머신러닝(Machine Learning)에서 "학습"이란 무엇을 의미하는가?',
    options: [
      '사람이 직접 규칙을 프로그래밍하는 것',
      '데이터에서 패턴을 찾아 모델을 자동으로 개선하는 것',
      '컴퓨터 하드웨어를 업그레이드하는 것',
      '인터넷에서 정보를 검색하는 것',
    ],
    answer: 1,
    explanation: '머신러닝에서 학습은 데이터로부터 패턴을 자동으로 발견하고, 이를 기반으로 예측/분류 성능을 높이는 과정입니다.',
  },
  {
    id: 'u1q3', unit: 'u1', topic: 'AI 기초', level: 1,
    question: '지도학습(Supervised Learning)에 해당하는 예시는?',
    options: [
      '이메일이 스팸인지 아닌지 분류하기',
      '데이터의 군집(클러스터)을 자동으로 찾기',
      '게임에서 점수를 최대화하는 전략 학습하기',
      '텍스트에서 주요 키워드 추출하기',
    ],
    answer: 0,
    explanation: '스팸 분류는 "스팸/정상"이라는 레이블(정답)이 있는 데이터로 학습하는 지도학습의 대표적인 예입니다.',
  },
  {
    id: 'u1q4', unit: 'u1', topic: 'AI 기초', level: 1,
    question: '비지도학습(Unsupervised Learning)의 특징은?',
    options: [
      '레이블이 있는 데이터로 학습한다',
      '보상 신호를 통해 학습한다',
      '정답 레이블 없이 데이터의 숨겨진 구조를 발견한다',
      '사람이 매번 정답을 알려주며 학습한다',
    ],
    answer: 2,
    explanation: '비지도학습은 정답 레이블 없이 데이터 자체의 패턴, 군집, 분포 등을 스스로 발견하는 학습 방식입니다.',
  },
];

const u2_questions: Question[] = [
  {
    id: 'u2q1', unit: 'u2', topic: '데이터', level: 1,
    question: '학습 데이터와 테스트 데이터를 나누는 이유는?',
    options: [
      '데이터를 절약하기 위해',
      '모델이 새로운 데이터에 얼마나 잘 일반화되는지 평가하기 위해',
      '컴퓨터 속도를 높이기 위해',
      '데이터를 암호화하기 위해',
    ],
    answer: 1,
    explanation: '테스트 데이터는 모델이 학습 중에 보지 못한 데이터로, 실제 환경에서의 성능(일반화 능력)을 공정하게 평가합니다.',
  },
  {
    id: 'u2q2', unit: 'u2', topic: '데이터', level: 1,
    question: '과적합(Overfitting)이란?',
    options: [
      '모델이 학습 데이터에는 잘 맞지만 새 데이터에는 성능이 낮은 현상',
      '모델이 모든 데이터에 성능이 낮은 현상',
      '데이터가 너무 많아 학습이 느려지는 현상',
      '모델의 파라미터 수가 너무 적은 현상',
    ],
    answer: 0,
    explanation: '과적합은 모델이 학습 데이터의 노이즈까지 외워버려 새로운 데이터에서 일반화 성능이 떨어지는 현상입니다.',
  },
  {
    id: 'u2q3', unit: 'u2', topic: '데이터', level: 1,
    question: '다음 중 머신러닝의 특징(Feature)에 해당하는 것은?',
    options: [
      '모델의 최종 예측 결과',
      '학습에 사용되는 입력 변수(나이, 키, 가격 등)',
      '데이터베이스의 테이블 이름',
      '신경망의 층(Layer) 수',
    ],
    answer: 1,
    explanation: '특징(Feature)은 모델에 입력되는 변수로, 예측에 사용되는 데이터의 속성입니다. 예: 집값 예측에서 면적·위치 등.',
  },
  {
    id: 'u2q4', unit: 'u2', topic: '데이터', level: 1,
    question: '결측값(Missing Value)을 처리하는 일반적인 방법이 아닌 것은?',
    options: [
      '평균값으로 대체하기',
      '해당 행 삭제하기',
      '중간값으로 대체하기',
      '데이터를 2배로 복사하기',
    ],
    answer: 3,
    explanation: '결측값 처리 방법에는 평균/중간값 대체, 행 삭제, 모델 기반 대체 등이 있습니다. 데이터를 단순 복사하는 것은 결측값 처리 방법이 아닙니다.',
  },
];

// ─────────────────────────────────────────────
// LEVEL 2 – AI 기초 (📘)
// ─────────────────────────────────────────────
const u3_questions: Question[] = [
  {
    id: 'u3q1', unit: 'u3', topic: '신경망', level: 2,
    question: '딥러닝(Deep Learning)과 일반 머신러닝의 핵심 차이점은?',
    options: [
      '딥러닝은 규칙 기반, 머신러닝은 데이터 기반',
      '딥러닝은 다층 신경망으로 특징을 자동 추출, 머신러닝은 수동 특징 설계',
      '딥러닝은 소량 데이터에 강점, 머신러닝은 대량 데이터 필요',
      '딥러닝은 분류만 가능, 머신러닝은 회귀도 가능',
    ],
    answer: 1,
    explanation: '딥러닝의 핵심 강점은 다층 신경망을 통해 원본 데이터에서 유용한 특징을 자동으로 추출한다는 점입니다.',
  },
  {
    id: 'u3q2', unit: 'u3', topic: '신경망', level: 2,
    question: '활성화 함수(Activation Function)의 역할은?',
    options: [
      '가중치를 초기화하는 역할',
      '신경망에 비선형성을 도입하여 복잡한 패턴 학습을 가능하게 함',
      '데이터를 정규화하는 역할',
      '손실 함수를 계산하는 역할',
    ],
    answer: 1,
    explanation: '활성화 함수(ReLU, Sigmoid 등)는 신경망에 비선형성을 부여하여, 선형 변환만으로는 표현할 수 없는 복잡한 패턴을 학습하게 해줍니다.',
  },
  {
    id: 'u3q3', unit: 'u3', topic: '신경망', level: 2,
    question: '역전파(Backpropagation)는 무엇을 위한 알고리즘인가?',
    options: [
      '순방향으로 예측 결과를 계산',
      '손실 함수의 기울기를 계산해 가중치를 업데이트',
      '데이터를 배치 단위로 분할',
      '모델을 배포하고 서빙하는 과정',
    ],
    answer: 1,
    explanation: '역전파는 출력층에서 입력층 방향으로 손실 함수의 편미분(기울기)을 계산하여 각 가중치를 업데이트하는 핵심 학습 알고리즘입니다.',
  },
  {
    id: 'u3q4', unit: 'u3', topic: '신경망', level: 2,
    question: 'CNN(합성곱 신경망)이 이미지 처리에 적합한 이유는?',
    options: [
      '이미지를 1차원 벡터로 변환하여 처리하기 때문에',
      '이미지의 공간적 특징(에지, 텍스처)을 지역적으로 추출하기 때문에',
      '모든 픽셀에 동일한 가중치를 적용하기 때문에',
      '이미지를 압축하여 저장 공간을 줄이기 때문에',
    ],
    answer: 1,
    explanation: 'CNN은 필터(커널)를 통해 이미지의 공간 구조를 보존하면서 에지, 텍스처, 형태 등의 지역적 특징을 계층적으로 추출합니다.',
  },
];

const u4_questions: Question[] = [
  {
    id: 'u4q1', unit: 'u4', topic: 'LLM', level: 2,
    question: 'Transformer 아키텍처의 핵심 메커니즘은?',
    options: [
      '합성곱 연산(Convolution)',
      '순환 연결(Recurrent Connection)',
      '자기 주의 메커니즘(Self-Attention)',
      '마르코프 체인(Markov Chain)',
    ],
    answer: 2,
    explanation: 'Transformer는 Self-Attention 메커니즘을 사용해 시퀀스 내 모든 위치 간의 관계를 병렬로 처리합니다.',
  },
  {
    id: 'u4q2', unit: 'u4', topic: 'LLM', level: 2,
    question: 'GPT 계열 모델에서 "생성(Generation)"은 어떻게 이루어지는가?',
    options: [
      '다음 토큰의 확률 분포를 예측해 순차적으로 토큰을 생성',
      '전체 문장을 한 번에 생성하는 방식',
      '데이터베이스에서 가장 유사한 문장을 검색',
      '규칙 기반 문법으로 문장을 조합',
    ],
    answer: 0,
    explanation: 'GPT는 자기회귀(autoregressive) 방식으로, 이전 토큰들을 바탕으로 다음 토큰의 확률을 예측해 텍스트를 순차적으로 생성합니다.',
  },
  {
    id: 'u4q3', unit: 'u4', topic: '프롬프트', level: 2,
    question: 'Few-shot prompting이란?',
    options: [
      '모델에게 예시 없이 지시만 주는 방식(Zero-shot)',
      '몇 가지 입출력 예시를 프롬프트에 포함하여 모델을 안내하는 방식',
      '파인튜닝으로 소량의 데이터로 학습하는 방식',
      '짧은 프롬프트로 빠른 응답을 유도하는 방식',
    ],
    answer: 1,
    explanation: 'Few-shot prompting은 프롬프트에 몇 가지 입출력 예시를 포함해 모델이 원하는 패턴으로 응답하도록 유도하는 기법입니다.',
  },
  {
    id: 'u4q4', unit: 'u4', topic: 'LLM', level: 2,
    question: 'RAG(Retrieval-Augmented Generation)의 주요 목적은?',
    options: [
      '모델 추론 속도를 높이기 위해',
      '외부 지식을 검색해 생성 정확도와 최신성을 높이기 위해',
      '더 많은 파라미터로 모델을 확장하기 위해',
      '강화학습으로 모델을 미세조정하기 위해',
    ],
    answer: 1,
    explanation: 'RAG는 외부 데이터베이스에서 관련 정보를 검색해 컨텍스트로 활용함으로써 LLM의 응답 정확도와 최신성을 높입니다.',
  },
];

const u5_questions: Question[] = [
  {
    id: 'u5q1', unit: 'u5', topic: 'AI 윤리', level: 2,
    question: 'AI 모델의 할루시네이션(Hallucination)이란?',
    options: [
      '모델이 훈련 데이터를 그대로 외우는 현상',
      '모델이 사실과 다른 정보를 사실처럼 자신있게 생성하는 현상',
      '모델이 응답을 거부하는 현상',
      '모델이 이미지를 텍스트로 변환하는 기능',
    ],
    answer: 1,
    explanation: '할루시네이션은 AI가 실제로는 존재하지 않거나 잘못된 정보를 사실처럼 생성하는 현상으로, LLM의 주요 신뢰성 문제 중 하나입니다.',
  },
  {
    id: 'u5q2', unit: 'u5', topic: 'AI 안전', level: 2,
    question: 'RLHF(Reinforcement Learning from Human Feedback)의 목적은?',
    options: [
      '학습 속도를 높이기 위해',
      '인간의 가치와 선호에 맞게 AI 행동을 정렬(Alignment)하기 위해',
      '파라미터 수를 줄이기 위해',
      '다국어 처리 능력을 향상시키기 위해',
    ],
    answer: 1,
    explanation: 'RLHF는 인간의 피드백을 보상 신호로 활용해 모델의 출력을 인간의 의도·가치에 맞게 조정하는 AI 정렬 기법입니다.',
  },
  {
    id: 'u5q3', unit: 'u5', topic: 'AI 윤리', level: 2,
    question: 'AI 편향(Bias)이 발생하는 주요 원인은?',
    options: [
      '모델의 파라미터 수가 너무 많기 때문',
      '학습 데이터 자체에 사회적 편견이나 불균형이 포함되어 있기 때문',
      '컴퓨팅 파워가 부족하기 때문',
      '모델 학습 속도가 너무 빠르기 때문',
    ],
    answer: 1,
    explanation: 'AI 편향은 주로 학습 데이터에 내재된 사회적 편견, 특정 집단 과소 대표, 데이터 불균형 등에서 비롯됩니다.',
  },
];

// ─────────────────────────────────────────────
// LEVEL 3 – AI 응용 (⚡)
// ─────────────────────────────────────────────
const u6_questions: Question[] = [
  {
    id: 'u6q1', unit: 'u6', topic: '생성형 AI', level: 3,
    question: 'Stable Diffusion에서 사용되는 핵심 기술은?',
    options: [
      'GAN (Generative Adversarial Network)',
      'Latent Diffusion Model (잠재 확산 모델)',
      'VAE (Variational Autoencoder)만 사용',
      'Transformer Decoder 단독 사용',
    ],
    answer: 1,
    explanation: 'Stable Diffusion은 VAE로 압축된 잠재 공간(Latent Space)에서 확산 과정을 수행하는 Latent Diffusion Model입니다.',
  },
  {
    id: 'u6q2', unit: 'u6', topic: '생성형 AI', level: 3,
    question: 'GAN(생성적 적대 신경망)에서 생성자(Generator)와 판별자(Discriminator)의 관계는?',
    options: [
      '둘 다 같은 목적으로 협력한다',
      '생성자는 가짜 데이터를 만들고, 판별자는 진짜/가짜를 구분하며 서로 경쟁한다',
      '판별자가 생성자에게 학습 데이터를 제공한다',
      '생성자가 판별자의 가중치를 직접 수정한다',
    ],
    answer: 1,
    explanation: 'GAN은 생성자(진짜 같은 가짜 생성)와 판별자(진짜/가짜 구분) 두 네트워크가 서로 경쟁하며 발전하는 구조입니다.',
  },
  {
    id: 'u6q3', unit: 'u6', topic: '생성형 AI', level: 3,
    question: '이미지 생성 모델에서 "프롬프트 가이던스(Classifier-Free Guidance)"의 역할은?',
    options: [
      '모델의 크기를 줄이는 기술',
      '텍스트 프롬프트에 얼마나 강하게 따를지 조절하는 기술',
      '이미지를 자동으로 분류하는 기술',
      '학습 데이터를 증강하는 기술',
    ],
    answer: 1,
    explanation: 'CFG(Classifier-Free Guidance)는 조건부/무조건부 예측의 차이를 증폭시켜 텍스트 프롬프트에 얼마나 충실하게 이미지를 생성할지 조절합니다.',
  },
  {
    id: 'u6q4', unit: 'u6', topic: '생성형 AI', level: 3,
    question: 'GitHub Copilot이 기반하는 주요 기술은?',
    options: [
      'BERT',
      'GPT 계열 코드 특화 모델 (Codex)',
      'T5',
      'AlphaCode',
    ],
    answer: 1,
    explanation: 'GitHub Copilot은 OpenAI의 Codex(GPT 기반 코드 특화 모델)를 기반으로 코드 자동완성·생성 기능을 제공합니다.',
  },
];

const u7_questions: Question[] = [
  {
    id: 'u7q1', unit: 'u7', topic: '파인튜닝', level: 3,
    question: '파인튜닝(Fine-tuning)이란?',
    options: [
      '새로운 모델을 처음부터 학습하는 것',
      '사전 학습된 모델을 특정 작업의 데이터로 추가 학습시키는 것',
      '모델의 파라미터를 랜덤으로 초기화하는 것',
      '모델을 더 작은 크기로 압축하는 것',
    ],
    answer: 1,
    explanation: '파인튜닝은 대규모로 사전 학습된 모델(예: GPT)을 특정 도메인·태스크 데이터로 추가 학습시켜 성능을 특화하는 기법입니다.',
  },
  {
    id: 'u7q2', unit: 'u7', topic: '파인튜닝', level: 3,
    question: 'LoRA(Low-Rank Adaptation)의 핵심 아이디어는?',
    options: [
      '모델의 모든 가중치를 동일하게 업데이트',
      '원본 가중치는 고정하고 저랭크 행렬을 추가하여 효율적으로 파인튜닝',
      '모델을 여러 개 복사하여 앙상블 학습',
      '데이터를 저해상도로 압축하여 학습 속도를 높임',
    ],
    answer: 1,
    explanation: 'LoRA는 기존 가중치를 고정한 채 저랭크(Low-Rank) 행렬 두 개를 삽입해 파라미터를 크게 줄이면서 효과적으로 파인튜닝하는 기법입니다.',
  },
  {
    id: 'u7q3', unit: 'u7', topic: 'MLOps', level: 3,
    question: 'MLOps의 주요 목적은?',
    options: [
      'AI 모델을 더 빠르게 학습시키는 것',
      'ML 모델 개발, 배포, 모니터링 프로세스를 자동화하고 표준화하는 것',
      '데이터를 더 효율적으로 저장하는 것',
      '모델의 파라미터 수를 줄이는 것',
    ],
    answer: 1,
    explanation: 'MLOps는 ML 모델의 개발(Dev)과 운영(Ops)을 통합하여 모델 배포·모니터링·재학습 파이프라인을 자동화·표준화하는 실천 방법론입니다.',
  },
  {
    id: 'u7q4', unit: 'u7', topic: 'MLOps', level: 3,
    question: '모델 드리프트(Model Drift)란?',
    options: [
      '모델이 학습 중에 발산하는 현상',
      '배포 후 실제 데이터 분포가 변해 모델 성능이 저하되는 현상',
      '모델 파일이 손상되는 현상',
      '학습률이 너무 커 최적점을 지나치는 현상',
    ],
    answer: 1,
    explanation: '모델 드리프트는 배포 후 시간이 지나면서 실제 입력 데이터의 분포가 학습 데이터와 달라져 모델 성능이 저하되는 현상입니다.',
  },
];

// ─────────────────────────────────────────────
// LEVEL 4 – AI 전문가 (🔥)
// ─────────────────────────────────────────────
const u8_questions: Question[] = [
  {
    id: 'u8q1', unit: 'u8', topic: '고급 아키텍처', level: 4,
    question: 'Mixture of Experts(MoE) 모델의 핵심 특징은?',
    options: [
      '모든 파라미터를 모든 입력에 항상 사용',
      '입력에 따라 일부 전문가 네트워크만 선택적으로 활성화',
      '여러 모델의 예측을 단순 평균하는 앙상블',
      '하나의 대형 모델을 여러 작은 모델로 분리',
    ],
    answer: 1,
    explanation: 'MoE는 게이팅 네트워크가 입력마다 적절한 전문가(Expert) 일부만 활성화해 전체 파라미터 수 대비 연산량을 크게 줄입니다.',
  },
  {
    id: 'u8q2', unit: 'u8', topic: '고급 아키텍처', level: 4,
    question: 'Flash Attention 알고리즘이 해결하는 문제는?',
    options: [
      'Attention의 시간복잡도를 O(n)으로 줄임',
      'HBM I/O 병목을 줄여 Attention 연산의 메모리 효율과 속도를 개선',
      'Attention 행렬을 저랭크로 근사',
      '멀티헤드 어텐션의 헤드 수를 자동으로 선택',
    ],
    answer: 1,
    explanation: 'Flash Attention은 타일링(Tiling) 기법으로 HBM(고대역폭 메모리) 접근을 최소화해 Attention의 메모리 효율과 연산 속도를 크게 개선합니다.',
  },
  {
    id: 'u8q3', unit: 'u8', topic: '강화학습', level: 4,
    question: 'PPO(Proximal Policy Optimization) 알고리즘의 핵심 아이디어는?',
    options: [
      '가치 함수 없이 정책만 학습',
      '정책 업데이트 폭을 클리핑으로 제한하여 안정적인 학습',
      '몬테카를로 방법만 사용하여 보상을 추정',
      '정책 경사를 사용하지 않고 Q-러닝만 사용',
    ],
    answer: 1,
    explanation: 'PPO는 클리핑된 대리 목적 함수(Clipped Surrogate Objective)로 정책 업데이트 폭을 제한해 학습 안정성을 확보한 RLHF의 핵심 알고리즘입니다.',
  },
  {
    id: 'u8q4', unit: 'u8', topic: '고급 아키텍처', level: 4,
    question: '양자화(Quantization)의 목적과 트레이드오프는?',
    options: [
      '모델 정확도를 높이기 위해 파라미터를 더 높은 정밀도로 변환',
      '파라미터를 낮은 비트(int8, int4 등)로 표현해 메모리·속도를 개선하되 약간의 정확도 손실 감수',
      '가중치를 랜덤하게 제거하여 모델을 희소화',
      '배치 크기를 줄여 학습 메모리를 절약',
    ],
    answer: 1,
    explanation: '양자화는 float32 가중치를 int8/int4 등으로 변환해 메모리 사용량과 추론 속도를 크게 개선하지만 약간의 정확도 저하가 발생합니다.',
  },
];

const u9_questions: Question[] = [
  {
    id: 'u9q1', unit: 'u9', topic: 'AI 에이전트', level: 4,
    question: 'AI 에이전트(Agent)가 일반 LLM 호출과 다른 핵심 특징은?',
    options: [
      '더 큰 파라미터 수의 모델을 사용',
      '도구 사용·계획·다단계 추론으로 자율적으로 목표를 달성',
      '빠른 응답 속도',
      '더 많은 학습 데이터 사용',
    ],
    answer: 1,
    explanation: 'AI 에이전트는 단순 텍스트 생성을 넘어 도구(검색, 코드 실행 등)를 사용하고, 계획을 세우며, 다단계 추론으로 복잡한 목표를 자율 수행합니다.',
  },
  {
    id: 'u9q2', unit: 'u9', topic: 'AI 에이전트', level: 4,
    question: 'ReAct(Reasoning + Acting) 프레임워크에서 에이전트는 어떻게 동작하는가?',
    options: [
      '한 번에 모든 행동을 계획한 후 실행',
      '추론(Thought) → 행동(Action) → 관찰(Observation)을 반복하며 문제 해결',
      '강화학습으로 보상을 최대화하는 정책 학습',
      '단순히 검색 결과를 프롬프트에 붙여 응답 생성',
    ],
    answer: 1,
    explanation: 'ReAct는 LLM이 Thought(추론)→Action(도구 실행)→Observation(결과 관찰) 루프를 반복하며 단계적으로 복잡한 문제를 해결하는 프레임워크입니다.',
  },
  {
    id: 'u9q3', unit: 'u9', topic: '멀티모달', level: 4,
    question: 'Vision-Language Model(VLM)에서 이미지와 텍스트를 함께 처리하는 방법은?',
    options: [
      '이미지를 먼저 텍스트로 변환한 후 텍스트만 처리',
      '이미지 인코더(ViT 등)로 시각 특징을 추출해 언어 모델 임베딩 공간에 정렬',
      '텍스트와 이미지를 완전히 별도 모델로 처리',
      '픽셀 값을 그대로 문자로 변환하여 입력',
    ],
    answer: 1,
    explanation: 'VLM은 비전 인코더(ViT 등)로 이미지 특징을 추출하고, 프로젝션 레이어를 통해 언어 모델의 토큰 임베딩 공간에 정렬하여 멀티모달 이해를 구현합니다.',
  },
  {
    id: 'u9q4', unit: 'u9', topic: '컨텍스트 윈도우', level: 4,
    question: '긴 컨텍스트 윈도우(Long Context Window)를 지원하기 위한 기술적 도전은?',
    options: [
      '배치 크기를 줄여야 한다',
      'Attention의 시간·공간 복잡도가 시퀀스 길이의 제곱에 비례해 메모리·연산량이 폭증',
      '어휘 크기를 줄여야 한다',
      '레이어 수를 늘려야 한다',
    ],
    answer: 1,
    explanation: '표준 Self-Attention은 O(n²) 복잡도를 가져 컨텍스트 길이 n이 늘어날수록 메모리와 연산량이 제곱으로 증가합니다. 이를 해결하기 위해 Flash Attention, Sparse Attention 등이 연구됩니다.',
  },
];

// ─────────────────────────────────────────────
// UNITS array
// ─────────────────────────────────────────────
export const UNITS: Unit[] = [
  {
    id: 'u1', title: 'AI란 무엇인가?', icon: '🤖', description: 'AI의 기본 개념과 머신러닝 유형',
    level: 1, questions: u1_questions,
  },
  {
    id: 'u2', title: '데이터와 학습', icon: '📊', description: '학습 데이터, 과적합, 특징 이해',
    level: 1, questions: u2_questions,
  },
  {
    id: 'u3', title: '신경망 기초', icon: '🧠', description: '딥러닝, 활성화 함수, 역전파',
    level: 2, questions: u3_questions,
  },
  {
    id: 'u4', title: 'LLM & 프롬프트', icon: '💬', description: 'Transformer, GPT, 프롬프트 엔지니어링',
    level: 2, questions: u4_questions,
  },
  {
    id: 'u5', title: 'AI 윤리와 안전', icon: '⚖️', description: '할루시네이션, RLHF, AI 편향',
    level: 2, questions: u5_questions,
  },
  {
    id: 'u6', title: '생성형 AI', icon: '🎨', description: '이미지·코드 생성, GAN, Diffusion',
    level: 3, questions: u6_questions,
  },
  {
    id: 'u7', title: '파인튜닝 & MLOps', icon: '⚙️', description: 'LoRA, 파인튜닝, 모델 배포',
    level: 3, questions: u7_questions,
  },
  {
    id: 'u8', title: '고급 아키텍처', icon: '🔬', description: 'MoE, Flash Attention, 양자화',
    level: 4, questions: u8_questions,
  },
  {
    id: 'u9', title: 'AI 에이전트 & 멀티모달', icon: '🚀', description: 'AI Agent, ReAct, VLM',
    level: 4, questions: u9_questions,
  },
];

// ─────────────────────────────────────────────
// DIAGNOSTIC QUESTIONS – 8 questions (2 per level)
// ─────────────────────────────────────────────
export const DIAGNOSTIC_QUESTIONS: Question[] = [
  // Level 1 – Easy
  {
    id: 'dq1', unit: 'diagnostic', topic: 'AI 기초', level: 1,
    question: '머신러닝에서 "학습"이란 무엇인가?',
    options: [
      '사람이 직접 규칙을 프로그래밍하는 것',
      '데이터에서 패턴을 찾아 모델을 자동으로 개선하는 것',
      '컴퓨터 하드웨어를 업그레이드하는 것',
      '인터넷에서 정보를 검색하는 것',
    ],
    answer: 1,
    explanation: '머신러닝에서 학습은 데이터로부터 패턴을 자동으로 발견해 예측 성능을 높이는 과정입니다.',
  },
  {
    id: 'dq2', unit: 'diagnostic', topic: 'AI 기초', level: 1,
    question: '지도학습(Supervised Learning)의 특징은?',
    options: [
      '정답 레이블 없이 데이터의 구조를 학습한다',
      '보상 신호를 통해 행동을 최적화한다',
      '입력 데이터와 정답(레이블)이 쌍을 이루어 학습한다',
      '인터넷에서 데이터를 실시간으로 수집한다',
    ],
    answer: 2,
    explanation: '지도학습은 입력(X)과 출력(Y) 쌍이 주어진 레이블 데이터로 학습하는 방식입니다.',
  },
  // Level 2 – Medium-Easy
  {
    id: 'dq3', unit: 'diagnostic', topic: '신경망', level: 2,
    question: '딥러닝에서 과적합(Overfitting)을 방지하는 방법은?',
    options: [
      '학습률을 무한히 높이기',
      '드롭아웃(Dropout), 정규화(Regularization), 데이터 증강',
      '레이어 수를 무한히 늘리기',
      '학습 데이터를 모두 삭제하기',
    ],
    answer: 1,
    explanation: '과적합 방지에는 드롭아웃, L1/L2 정규화, 데이터 증강, 조기 종료(Early Stopping) 등이 효과적입니다.',
  },
  {
    id: 'dq4', unit: 'diagnostic', topic: 'LLM', level: 2,
    question: 'Transformer 아키텍처의 핵심 메커니즘은?',
    options: [
      '합성곱(Convolution)',
      '순환 연결(Recurrent)',
      '자기 주의(Self-Attention)',
      '결정 트리(Decision Tree)',
    ],
    answer: 2,
    explanation: 'Transformer는 Self-Attention으로 시퀀스 내 모든 위치 간 관계를 병렬로 처리합니다.',
  },
  // Level 3 – Medium-Hard
  {
    id: 'dq5', unit: 'diagnostic', topic: '생성형 AI', level: 3,
    question: 'GAN(생성적 적대 신경망)에서 생성자(Generator)의 목표는?',
    options: [
      '진짜 데이터와 가짜 데이터를 구분하기',
      '판별자를 속일 수 있는 진짜 같은 가짜 데이터를 생성하기',
      '학습 데이터를 압축하기',
      '레이블을 자동으로 생성하기',
    ],
    answer: 1,
    explanation: '생성자는 판별자가 진짜로 착각할 만큼 실제 데이터와 유사한 가짜 데이터를 생성하는 것이 목표입니다.',
  },
  {
    id: 'dq6', unit: 'diagnostic', topic: '파인튜닝', level: 3,
    question: 'LoRA 파인튜닝이 기존 Full Fine-tuning보다 유리한 이유는?',
    options: [
      '모델 성능이 항상 더 높기 때문',
      '저랭크 행렬만 학습해 학습 파라미터 수와 메모리를 크게 줄일 수 있기 때문',
      '어떤 모델에도 적용이 불가능하기 때문',
      '학습 데이터가 많을수록 효과가 없기 때문',
    ],
    answer: 1,
    explanation: 'LoRA는 원본 가중치를 고정하고 저랭크 행렬만 학습해 파라미터·메모리 효율이 뛰어나 소규모 GPU에서도 대형 모델을 파인튜닝할 수 있습니다.',
  },
  // Level 4 – Hard
  {
    id: 'dq7', unit: 'diagnostic', topic: '고급 아키텍처', level: 4,
    question: 'Mixture of Experts(MoE) 모델의 핵심 장점은?',
    options: [
      '모든 파라미터를 항상 활성화하여 일관된 성능 보장',
      '전체 파라미터 수는 크지만 실제 추론 시 일부 전문가만 활성화해 연산 효율 확보',
      '단일 대형 밀집 모델보다 항상 성능이 낮음',
      '양자화 없이도 모델 크기 감소',
    ],
    answer: 1,
    explanation: 'MoE는 총 파라미터 수는 매우 크지만 입력마다 일부 Expert만 활성화(Sparse Activation)해 Dense 모델 대비 연산 비용을 크게 줄입니다.',
  },
  {
    id: 'dq8', unit: 'diagnostic', topic: 'AI 에이전트', level: 4,
    question: 'ReAct 프레임워크에서 AI 에이전트의 동작 패턴은?',
    options: [
      '한 번에 모든 계획을 수립 후 순차 실행',
      'Thought → Action → Observation 루프를 반복하며 단계적으로 문제 해결',
      '보상을 최대화하는 강화학습만 사용',
      '인간 피드백 없이 완전 자율 학습',
    ],
    answer: 1,
    explanation: 'ReAct는 LLM이 추론(Thought)→도구 실행(Action)→결과 관찰(Observation) 루프를 반복하며 복잡한 다단계 문제를 해결하는 에이전트 패턴입니다.',
  },
];
