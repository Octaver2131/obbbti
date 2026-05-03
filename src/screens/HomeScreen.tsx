import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>HKTI</Text>
          <Text style={styles.subtitle}>MBTI Honkai Impact ver</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>小祈 の 测试</Text>
          <Text style={styles.cardDescription}>
            非正式版本（欸嘿
          </Text>
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>75道精选问题</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>️</Text>
              <Text style={styles.featureText}>约5分钟完成</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>5维详细分析</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>开始测试</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personalitiesButton}
          onPress={() => navigation.navigate('Personalities')}
          activeOpacity={0.8}
        >
          <Text style={styles.personalitiesButtonText}>查看所有人格</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.md * 1.6,
    marginBottom: theme.spacing.lg,
  },
  features: {
    gap: theme.spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: theme.fontSize.xl,
    marginRight: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  startButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },
  personalitiesButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  personalitiesButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
});
