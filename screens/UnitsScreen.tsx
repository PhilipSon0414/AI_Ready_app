import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UNITS } from '../data/questions';
import { getUnitProgress } from '../store/useAppStore';

export default function UnitsScreen() {
  const nav = useNavigation<any>();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useFocusEffect(
    useCallback(() => {
      forceUpdate();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Ready</Text>
        <Text style={styles.subtitle}>AI 자격증 대비 학습</Text>
      </View>
      <FlatList
        data={UNITS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const prog = getUnitProgress(item.id);
          const pct = prog.total === 0 ? 0 : (prog.completed / prog.total) * 100;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => nav.navigate('Quiz', { unitId: item.id })}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.info}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {prog.completed}/{prog.total}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#6C63FF',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { fontSize: 36, marginRight: 14 },
  info: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  desc: { fontSize: 12, color: '#888', marginTop: 2, marginBottom: 8 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E8ECF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#6C63FF', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#9E9E9E', minWidth: 32, textAlign: 'right' },
});
