import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signIn, signUp } from '../store/useAppStore';

type Props = {
  onSuccess: () => void;
  onSkip: () => void;
};

export default function AuthScreen({ onSuccess, onSkip }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit() {
    setError(null);
    if (!validateEmail(email)) {
      setError('이메일 형식이 올바르지 않습니다');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }
    if (tab === 'signup' && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);
    try {
      const result = tab === 'login'
        ? await signIn(email, password)
        : await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.robot}>🤖</Text>
        <Text style={styles.title}>AI Ready</Text>
        <Text style={styles.subtitle}>AI 학습의 시작</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => { setTab('login'); setError(null); }}
          >
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'signup' && styles.tabBtnActive]}
            onPress={() => { setTab('signup'); setError(null); }}
          >
            <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>회원가입</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@email.com"
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="6자 이상 입력"
            placeholderTextColor="#B0B0B0"
          />

          {tab === 'signup' && (
            <>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="비밀번호를 다시 입력"
                placeholderTextColor="#B0B0B0"
              />
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {tab === 'login' ? '로그인' : '회원가입'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>비회원으로 시작하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  inner: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  robot: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6C63FF', marginBottom: 32 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E8ECF0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
    width: '100%',
    maxWidth: 360,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9E9E9E' },
  tabTextActive: { color: '#6C63FF' },
  form: { width: '100%', maxWidth: 360 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  error: {
    color: '#E74C3C',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipBtn: { marginTop: 24 },
  skipText: { color: '#9E9E9E', fontSize: 14, textDecorationLine: 'underline' },
});
