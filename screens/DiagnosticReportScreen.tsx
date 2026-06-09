import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStore } from '../store/useAppStore';
import { generateReport, downloadReportAsPDF, sendReportByEmail } from '../lib/reportGenerator';

type RouteParams = {
  level: number;
  score: number;
  totalQuestions: number;
};

export default function DiagnosticReportScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { level, score, totalQuestions } = route.params as RouteParams;

  const store = getStore();
  const nickname = store.nickname || '익명 학습자';
  const isMember = !!(store as any).user || false;

  const report = generateReport({ nickname, level, score, totalQuestions });

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  function handleDownloadPDF() {
    downloadReportAsPDF(report);
  }

  function handleGoHome() {
    nav.replace('MainTabs');
  }

  async function handleSendEmail() {
    if (!emailInput.trim()) return;
    setSending(true);
    setSendResult(null);
    const result = await sendReportByEmail(report, emailInput.trim());
    setSending(false);
    if (result.success) {
      setSendResult('success');
    } else {
      setSendResult(result.error || '발송 실패');
    }
  }

  const pctWidth = `${report.score}%`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎉 진단 완료!</Text>
        <Text style={styles.headerSub}>AI & Python 역량 레포트</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Level Card */}
        <View style={styles.levelCard}>
          <Text style={styles.levelEmoji}>{report.emoji}</Text>
          <Text style={styles.levelTitle}>Lv.{report.level} {report.levelName}</Text>
          <Text style={styles.levelScore}>
            {report.correctAnswers}/{report.totalQuestions}문항 정답 ({report.score}%)
          </Text>
          {/* Score bar */}
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: pctWidth as any }]} />
          </View>
          <Text style={styles.generatedAt}>{report.generatedAt}</Text>
        </View>

        {/* Message */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{report.message}</Text>
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.greenText]}>✓ 강점 영역</Text>
          {report.strengths.map((s, i) => (
            <Text key={i} style={styles.bulletItem}>• {s}</Text>
          ))}
        </View>

        {/* Improvements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.redText]}>△ 성장 포인트</Text>
          {report.improvements.map((s, i) => (
            <Text key={i} style={styles.bulletItem}>• {s}</Text>
          ))}
        </View>

        {/* Next Steps */}
        <View style={[styles.section, styles.nextStepsBox]}>
          <Text style={[styles.sectionTitle, styles.blueText]}>→ 추천 다음 단계</Text>
          {report.nextSteps.map((s, i) => (
            <Text key={i} style={[styles.bulletItem, styles.nextStepText]}>{i + 1}. {s}</Text>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.pdfBtn} onPress={handleDownloadPDF}>
          <Text style={styles.pdfBtnText}>PDF 다운로드 📄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome}>
          <Text style={styles.homeBtnText}>학습 시작하기 →</Text>
        </TouchableOpacity>

        {!isMember && (
          <TouchableOpacity style={styles.emailBtn} onPress={() => setEmailModalVisible(true)}>
            <Text style={styles.emailBtnText}>이메일로 받기 📧</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Email Modal */}
      <Modal visible={emailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📧 이메일로 레포트 받기</Text>
            <Text style={styles.modalDesc}>이메일 주소를 입력하면 레포트를 보내드립니다.</Text>
            <TextInput
              style={styles.modalInput}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="이메일 주소 입력"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {sendResult === 'success' ? (
              <Text style={styles.successText}>✅ 이메일이 발송되었습니다!</Text>
            ) : sendResult ? (
              <Text style={styles.errorText}>❌ {sendResult}</Text>
            ) : null}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setEmailModalVisible(false); setSendResult(null); }}>
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSendBtn} onPress={handleSendEmail} disabled={sending}>
                {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSendText}>발송</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  scroll: { padding: 16, gap: 14, paddingBottom: 40 },

  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  levelEmoji: { fontSize: 48 },
  levelTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', textAlign: 'center' },
  levelScore: { fontSize: 14, color: '#666' },
  barBg: { width: '100%', height: 10, backgroundColor: '#E8ECF0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#6C63FF', borderRadius: 5 },
  generatedAt: { fontSize: 11, color: '#9E9E9E', marginTop: 4 },

  messageBox: {
    backgroundColor: '#F0EDFF',
    borderRadius: 14,
    padding: 16,
  },
  messageText: { fontSize: 14, color: '#333', lineHeight: 22 },

  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  greenText: { color: '#4CAF50' },
  redText: { color: '#EF5350' },
  blueText: { color: '#2196F3' },
  bulletItem: { fontSize: 13, color: '#444', lineHeight: 20 },
  nextStepsBox: { backgroundColor: '#E8F5E9' },
  nextStepText: { color: '#2E7D32' },

  pdfBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  pdfBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  homeBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  homeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  emailBtn: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  emailBtnText: { color: '#6C63FF', fontWeight: '700', fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  modalDesc: { fontSize: 13, color: '#666', lineHeight: 20 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A2E',
  },
  successText: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  errorText: { fontSize: 14, color: '#EF5350', fontWeight: '600' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalCancelText: { color: '#666', fontWeight: '600' },
  modalSendBtn: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalSendText: { color: '#fff', fontWeight: '700' },
});
