import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'jidong.son@gmail.com';

type Profile = {
  user_id: string;
  email: string;
  nickname: string;
  xp: number;
  diagnostic_level: number | null;
  created_at: string;
  last_active: string;
};

type Props = {
  user: { id: string; email: string } | null;
};

export default function AdminScreen({ user }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  async function fetchProfiles() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) {
        setError('데이터를 불러오지 못했습니다: ' + err.message);
      } else {
        setProfiles(data || []);
      }
    } catch (e: any) {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <View style={styles.noAccess}>
        <Text style={styles.noAccessIcon}>🔒</Text>
        <Text style={styles.noAccessTitle}>접근 권한이 없습니다</Text>
        <Text style={styles.noAccessDesc}>관리자 계정으로 로그인하세요</Text>
      </View>
    );
  }

  const totalUsers = profiles.length;
  const avgXp = totalUsers === 0 ? 0 : Math.round(profiles.reduce((sum, p) => sum + (p.xp || 0), 0) / totalUsers);

  // Level distribution
  const levelDist: Record<string, number> = {};
  profiles.forEach((p) => {
    const key = p.diagnostic_level !== null ? `레벨 ${p.diagnostic_level}` : '미진단';
    levelDist[key] = (levelDist[key] || 0) + 1;
  });

  function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', year: '2-digit' });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>🛡️ 관리자 패널</Text>

      {/* Stats Summary */}
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalUsers}</Text>
          <Text style={styles.statLabel}>총 가입자</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgXp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>평균 XP</Text>
        </View>
      </View>

      {/* Level Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>레벨별 분포</Text>
        {Object.entries(levelDist).sort().map(([level, count]) => (
          <View key={level} style={styles.distRow}>
            <Text style={styles.distLabel}>{level}</Text>
            <View style={styles.distBarWrap}>
              <View style={[styles.distBar, { width: totalUsers ? `${(count / totalUsers) * 100}%` : '0%' }]} />
            </View>
            <Text style={styles.distCount}>{count}명</Text>
          </View>
        ))}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchProfiles}>
        <Text style={styles.refreshBtnText}>🔄 새로고침</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} color="#6C63FF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* User Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용자 목록</Text>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>별명</Text>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 3 }]}>이메일</Text>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>레벨</Text>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>XP</Text>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>가입일</Text>
        </View>
        {profiles.length === 0 && !loading && (
          <Text style={styles.emptyText}>사용자 데이터가 없습니다</Text>
        )}
        {profiles.map((p) => (
          <View key={p.user_id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{p.nickname || '-'}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>{p.email || '-'}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{p.diagnostic_level !== null ? p.diagnostic_level : '-'}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{(p.xp || 0).toLocaleString()}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{formatDate(p.created_at)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },

  statRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: '600' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },

  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  distLabel: { fontSize: 12, color: '#555', width: 60 },
  distBarWrap: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 4, height: 8, overflow: 'hidden' },
  distBar: { height: 8, backgroundColor: '#6C63FF', borderRadius: 4 },
  distCount: { fontSize: 12, color: '#555', width: 30, textAlign: 'right' },

  refreshBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshBtnText: { color: '#6C63FF', fontWeight: '700', fontSize: 14 },
  errorText: { color: '#E74C3C', textAlign: 'center', marginBottom: 12, fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#9E9E9E', fontSize: 14, paddingVertical: 20 },

  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tableHeader: { borderBottomWidth: 2, borderBottomColor: '#E0E0E0', marginBottom: 2 },
  headerCell: { color: '#9E9E9E', fontWeight: '700', fontSize: 11 },
  tableCell: { fontSize: 12, color: '#333', paddingRight: 4 },

  noAccess: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', gap: 12 },
  noAccessIcon: { fontSize: 60 },
  noAccessTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  noAccessDesc: { fontSize: 14, color: '#9E9E9E' },
});
