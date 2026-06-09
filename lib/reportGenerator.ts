import { Platform } from 'react-native';

export type DiagnosticReport = {
  nickname: string;
  email?: string;
  level: number;
  levelName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  generatedAt: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  message: string;
  emoji: string;
};

// Level data for report
const LEVEL_DATA = [
  { name: 'AI 완전 입문', emoji: '🌿', color: '#78909C',
    strengths: ['호기심과 배움의 의지를 갖고 있어요', 'AI를 새롭게 배우는 멋진 첫걸음을 내디뎠어요'],
    improvements: ['AI의 기본 개념 이해', '머신러닝과 딥러닝의 차이 파악', 'AI 활용 사례 탐구'],
    nextSteps: ['Lv.0 AI 완전 입문 단원부터 시작', '유튜브 AI 추천 시스템 원리 이해하기', '챗GPT 직접 사용해보기'],
    message: '🎉 AI 여정의 첫 발을 내딛으셨군요! 모든 전문가도 처음엔 "AI가 뭔가요?"부터 시작했답니다. 천천히 함께 올라가 봐요!' },
  { name: 'AI 이름만 들어봤어요', emoji: '👂', color: '#66BB6A',
    strengths: ['AI 관련 뉴스와 트렌드에 관심이 있어요', 'AI 도구의 존재를 알고 있어요'],
    improvements: ['AI 핵심 용어 정확히 이해하기', '머신러닝의 기본 원리 파악', '데이터의 역할 이해'],
    nextSteps: ['Lv.1 AI 용어 정리 단원 수강', 'ChatGPT, Claude 등 AI 도구 직접 체험', '유튜브로 AI 입문 영상 시청'],
    message: '👂 "들어는 봤어요"에서 "나 이거 알아요!"로 성장할 준비가 됐군요! AI 용어들을 하나씩 정복해 나가면 금방 기초를 탄탄히 다질 수 있어요.' },
  { name: 'AI 개념 이해 중', emoji: '📖', color: '#42A5F5',
    strengths: ['AI의 기본 개념을 이해하고 있어요', '머신러닝의 종류를 구분할 수 있어요', '데이터의 중요성을 알고 있어요'],
    improvements: ['Python 코딩 시작하기', '실제 AI 모델 학습 과정 이해', '딥러닝 구조 파악'],
    nextSteps: ['Lv.3 Python 첫걸음 도전', 'Google Colab에서 간단한 코드 실행', 'Kaggle 입문 대회 구경하기'],
    message: '📖 개념 이해는 충분해요! 이제 손으로 직접 코드를 쳐볼 시간이에요. 처음엔 누구나 어색하지만, 한 번 맛들이면 멈출 수 없답니다 😄' },
  { name: '코딩 첫걸음', emoji: '💻', color: '#AB47BC',
    strengths: ['Python 기본 문법을 알고 있어요', '코드 실행 경험이 있어요', 'print() 함수로 출력할 수 있어요'],
    improvements: ['조건문과 반복문 능숙하게 활용', '함수 작성 및 모듈 사용', '기초 자료구조(리스트, 딕셔너리) 이해'],
    nextSteps: ['Lv.3-4 Python 기초/활용 단원 수강', '매일 작은 코딩 문제 1개씩 풀기', '프로그래머스 입문 문제 도전'],
    message: '💻 Hello World를 찍어봤다면 이미 절반은 성공한 거예요! 이제 변수, 조건문, 반복문으로 실제로 "움직이는" 코드를 만들어 봐요.' },
  { name: '파이썬 기초', emoji: '🐍', color: '#FF7043',
    strengths: ['Python 기본 문법을 활용할 수 있어요', '조건문과 반복문을 이해해요', '함수를 만들 수 있어요'],
    improvements: ['pandas로 데이터 처리', 'NumPy 수치 연산', '데이터 시각화 (matplotlib)'],
    nextSteps: ['Lv.5 데이터 분석 입문 단원 수강', 'pandas로 CSV 파일 열어보기', 'Kaggle 데이터셋으로 EDA 연습'],
    message: '🐍 Python이 이제 친구처럼 느껴지기 시작하셨나요? 이제 데이터를 다루는 강력한 도구들을 배우면 진짜 "데이터 분석가"가 될 수 있어요!' },
  { name: '데이터 분석 입문', emoji: '📊', color: '#FFA726',
    strengths: ['pandas로 데이터를 다룰 수 있어요', '기초 통계를 이해해요', '데이터 시각화가 가능해요'],
    improvements: ['머신러닝 알고리즘 이해', 'scikit-learn 활용', '모델 성능 평가 지표'],
    nextSteps: ['Lv.6 알고리즘 적용 단원 수강', 'scikit-learn으로 첫 ML 모델 만들기', 'Kaggle Titanic 생존자 예측 도전'],
    message: '📊 데이터를 보고 인사이트를 뽑아낼 수 있다니 대단해요! 이제 머신러닝으로 미래를 "예측"하는 모델을 만들어 볼 차례입니다. 흥미롭지 않나요?' },
  { name: '알고리즘 적용', emoji: '⚙️', color: '#EC407A',
    strengths: ['ML 알고리즘을 이해하고 적용할 수 있어요', 'scikit-learn을 활용할 수 있어요', '모델 성능을 평가할 수 있어요'],
    improvements: ['코드 디버깅 능력 강화', '코드 최적화 및 리팩토링', 'AI 프로젝트 전체 설계'],
    nextSteps: ['Lv.7 코드 마스터 단원 수강', '개인 ML 프로젝트 시작', 'GitHub에 포트폴리오 업로드'],
    message: '⚙️ 다양한 알고리즘을 자유롭게 다루시다니 인상적이에요! 이제 코드를 읽고 오류를 잡아내는 "코드 의사" 단계가 남았어요. 거의 다 왔습니다!' },
  { name: '코드 마스터', emoji: '🔥', color: '#8D6E63',
    strengths: ['코드 흐름을 빠르게 파악할 수 있어요', '오류를 찾아 수정할 수 있어요', 'AI 프로젝트를 처음부터 끝까지 설계할 수 있어요'],
    improvements: ['최신 AI 트렌드 지속 학습', '오픈소스 프로젝트 기여', '후배 개발자 멘토링'],
    nextSteps: ['논문 구현 프로젝트 도전', 'Kaggle 상위 대회 참가', 'AI 스터디 그룹 리드'],
    message: '🔥 대단해요! 최고 수준의 AI 역량을 갖추셨군요! 이제 배움을 나눠주세요 — 가르치는 것이 배우는 것보다 더 많은 것을 알게 해준답니다 🎓' },
];

export function generateReport(params: {
  nickname: string;
  level: number;
  score: number;
  totalQuestions: number;
}): DiagnosticReport {
  const { nickname, level, score, totalQuestions } = params;
  const data = LEVEL_DATA[level];
  const pct = Math.round((score / totalQuestions) * 100);

  return {
    nickname,
    level,
    levelName: data.name,
    score: pct,
    totalQuestions,
    correctAnswers: score,
    generatedAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
    strengths: data.strengths,
    improvements: data.improvements,
    nextSteps: data.nextSteps,
    message: data.message,
    emoji: data.emoji,
  };
}

export function downloadReportAsPDF(report: DiagnosticReport): void {
  if (Platform.OS !== 'web') return;

  const barWidth = report.score;
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans KR', sans-serif; background: #fff; color: #1a1a2e; width: 210mm; min-height: 297mm; padding: 0; }
  .header { background: #6C63FF; color: #fff; padding: 32px 28px 24px; }
  .header-title { font-size: 28px; font-weight: 900; margin-bottom: 4px; }
  .header-sub { font-size: 14px; opacity: 0.85; }
  .header-date { font-size: 11px; opacity: 0.7; margin-top: 6px; }
  .content { padding: 28px; }
  .name { font-size: 20px; font-weight: 900; text-align: center; margin-bottom: 20px; color: #1a1a2e; }
  .level-box { background: #f0edff; border-radius: 14px; padding: 20px 24px; margin-bottom: 18px; display: flex; align-items: center; gap: 20px; }
  .level-badge { font-size: 42px; }
  .level-info { flex: 1; }
  .level-num { font-size: 28px; font-weight: 900; color: #6C63FF; }
  .level-name { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-top: 2px; }
  .level-score { font-size: 12px; color: #666; margin-top: 4px; }
  .score-pct { font-size: 32px; font-weight: 900; color: #6C63FF; text-align: right; }
  .bar-bg { background: #e8ecf0; border-radius: 99px; height: 10px; margin: 10px 0; }
  .bar-fill { background: #6C63FF; border-radius: 99px; height: 10px; width: ${barWidth}%; }
  .message { background: #f0edff; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; font-size: 13px; line-height: 1.7; color: #333; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid currentColor; }
  .green { color: #4CAF50; }
  .red { color: #EF5350; }
  .blue-box { background: #e8f5e9; border-radius: 12px; padding: 16px 20px; }
  .blue-box .section-title { color: #2E7D32; border-color: #4CAF50; }
  ul, ol { padding-left: 20px; }
  li { font-size: 13px; line-height: 1.8; color: #333; }
  .footer { text-align: center; padding: 20px; font-size: 11px; color: #aaa; border-top: 1px solid #eee; margin-top: 10px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="header-title">🤖 AI Ready</div>
  <div class="header-sub">AI &amp; Python 역량 진단 레포트</div>
  <div class="header-date">${report.generatedAt}</div>
</div>
<div class="content">
  <div class="name">${report.nickname} 님의 역량 레포트</div>
  <div class="level-box">
    <div class="level-badge">${report.emoji}</div>
    <div class="level-info">
      <div class="level-num">Lv.${report.level}</div>
      <div class="level-name">${report.levelName}</div>
      <div class="level-score">진단 점수: ${report.correctAnswers}/${report.totalQuestions}문항 정답</div>
    </div>
    <div class="score-pct">${report.score}%</div>
  </div>
  <div class="bar-bg"><div class="bar-fill"></div></div>
  <div class="message">${report.message}</div>
  <div class="section">
    <div class="section-title green">✓ 강점 영역</div>
    <ul>${report.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="section">
    <div class="section-title red">△ 성장 포인트</div>
    <ul>${report.improvements.map(s => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="section blue-box">
    <div class="section-title">→ 추천 다음 단계</div>
    <ol>${report.nextSteps.map(s => `<li>${s}</li>`).join('')}</ol>
  </div>
</div>
<div class="footer">AI Ready — 당신의 AI 역량을 키워드립니다</div>
</body></html>`;

  const printWindow = (window as any).open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

export async function sendReportByEmail(report: DiagnosticReport, toEmail: string): Promise<{ success: boolean; error?: string }> {
  // Use Resend API - user needs RESEND_API_KEY
  const RESEND_API_KEY = 're_jWBH8HKK_ELb9tGQULWgcSYHiaSjgtDjn'; // Replace with actual key

  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><style>
body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f7fa; }
.header { background: #6C63FF; color: white; padding: 32px; text-align: center; border-radius: 12px 12px 0 0; }
.body { background: white; padding: 32px; }
.level-box { background: #f0edff; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
.score { font-size: 36px; font-weight: 800; color: #6C63FF; }
.bar-bg { background: #e8ecf0; border-radius: 99px; height: 12px; margin: 12px 0; }
.bar-fill { background: #6C63FF; border-radius: 99px; height: 12px; width: ${report.score}%; }
.message { background: #f0edff; border-radius: 12px; padding: 16px; margin: 16px 0; color: #333; line-height: 1.6; }
.section { margin: 20px 0; }
.section h3 { margin-bottom: 8px; }
.green { color: #4CAF50; } .red { color: #EF5350; } .blue { color: #2196F3; }
ul { padding-left: 20px; line-height: 1.8; }
.footer { background: #f5f7fa; text-align: center; padding: 20px; color: #999; font-size: 12px; border-radius: 0 0 12px 12px; }
</style></head>
<body>
<div class="header">
  <h1>AI Ready</h1>
  <p>AI & Python 역량 진단 레포트</p>
  <p style="font-size:12px;opacity:0.8">${report.generatedAt}</p>
</div>
<div class="body">
  <h2>${report.nickname} 님의 역량 레포트</h2>
  <div class="level-box">
    <div style="font-size:40px">${report.emoji}</div>
    <div style="font-size:28px;font-weight:800">Lv.${report.level} ${report.levelName}</div>
    <div style="color:#666">진단 점수: ${report.correctAnswers}/${report.totalQuestions}문항 정답</div>
    <div class="score">${report.score}%</div>
    <div class="bar-bg"><div class="bar-fill"></div></div>
  </div>
  <div class="message">${report.message}</div>
  <div class="section">
    <h3 class="green">강점 영역</h3>
    <ul>${report.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="section">
    <h3 class="red">성장 포인트</h3>
    <ul>${report.improvements.map(s => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="section" style="background:#e8f5e9;border-radius:12px;padding:16px">
    <h3 class="blue">추천 다음 단계</h3>
    <ol>${report.nextSteps.map(s => `<li>${s}</li>`).join('')}</ol>
  </div>
  <p style="text-align:center;margin-top:24px">
    <a href="https://strong-selkie-3f3035.netlify.app" style="background:#6C63FF;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700">AI Ready에서 학습 시작하기 →</a>
  </p>
</div>
<div class="footer">AI Ready — 당신의 AI 역량을 키워드립니다</div>
</body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'AI Ready <onboarding@resend.dev>',
        to: [toEmail],
        subject: `[AI Ready] ${report.nickname}님의 AI 역량 진단 레포트 - Lv.${report.level} ${report.levelName}`,
        html: htmlContent,
      }),
    });
    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.message || '발송 실패' };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
