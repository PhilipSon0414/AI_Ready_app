import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  email: string;
};

export default function SignupCompleteScreen({ email }: Props) {
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.checkmark}>✅</Text>
        <Text style={styles.title}>회원가입이 완료됐습니다!</Text>
        <Text style={styles.emailText}>
          <Text style={styles.emailHighlight}>{email}</Text> 으로{'\n'}가입되었습니다.
        </Text>
        <Text style={styles.nextDesc}>
          이제 AI 수준을{'\n'}진단해 볼까요?
        </Text>
        <TouchableOpacity style={styles.nextBtn} onPress={() => nav.navigate('DiagnosticIntro')}>
          <Text style={styles.nextBtnText}>다음 →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  checkmark: { fontSize: 72, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emailHighlight: { fontWeight: '700', color: '#6C63FF' },
  nextDesc: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  nextBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
