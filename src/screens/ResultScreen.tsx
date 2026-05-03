import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { theme } from '../theme';
import { getPersonalityResult } from '../data/personalities';
import { RootStackParamList, AnswerRecord, PersonalityResult, DimensionScore } from '../types';
import { questions } from '../data/questions';
import { saveLatestResult } from '../utils/resultStorage';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

const personalityThemeColors: Record<string, string> = {
  INTJ: '#8A64A1',
  INTP: '#8A64A1',
  ENTJ: '#8A64A1',
  ENTP: '#8A64A1',
  INFJ: '#39A774',
  INFP: '#39A774',
  ENFJ: '#39A774',
  ENFP: '#39A774',
  ISTJ: '#4B99B9',
  ISFJ: '#4B99B9',
  ESTJ: '#4B99B9',
  ESFJ: '#4B99B9',
  ISTP: '#E2A838',
  ISFP: '#E2A838',
  ESTP: '#E2A838',
  ESFP: '#E2A838',
};

function getPersonalityColor(type: string): string {
  const baseType = type.replace(/-[AT]$/, '');
  return personalityThemeColors[baseType] || theme.colors.primary;
}

export default function ResultScreen({ navigation, route }: Props) {
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const { answers } = route.params;
  const [themeColor, setThemeColor] = useState(theme.colors.primary);

  useEffect(() => {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    
    answers.forEach((answer: AnswerRecord) => {
      const dimension = answer.dimension as keyof typeof scores;
      scores[dimension] += answer.value;

      const question = questions.find((q) => q.id === answer.questionId);
      if (question?.influences) {
        question.influences.forEach((influence) => {
          const effect = answer.value > 0 ? influence.leftEffect : influence.rightEffect;
          const influenceDimension = influence.dimension as keyof typeof scores;
          scores[influenceDimension] += effect;
        });
      }
    });

    const dimensionMaxScores: Record<string, number> = {
      EI: 47,
      SN: 48,
      TF: 49,
      JP: 47,
      AT: 45,
    };

    let type = '';
    type += scores.EI >= 0 ? 'E' : 'I';
    type += scores.SN >= 0 ? 'S' : 'N';
    type += scores.TF >= 0 ? 'T' : 'F';
    type += scores.JP >= 0 ? 'J' : 'P';
    type += scores.AT >= 0 ? '-A' : '-T';

    const color = getPersonalityColor(type);
    setThemeColor(color);

    const calcPercentage = (score: number, dimension: string): number => {
      const maxPossible = dimensionMaxScores[dimension];
      const ratio = Math.max(-1, Math.min(1, score / maxPossible));
      return Math.round(50 + ratio * 50);
    };

    const personalityResult = getPersonalityResult(type);
    
    personalityResult.dimensions = {
      EI: {
        label: type.includes('E') ? '外向 (E)' : '内向 (I)',
        percentage: calcPercentage(scores.EI, 'EI'),
      },
      SN: {
        label: type.includes('S') ? '实感 (S)' : '直觉 (N)',
        percentage: calcPercentage(scores.SN, 'SN'),
      },
      TF: {
        label: type.includes('T') ? '思考 (T)' : '情感 (F)',
        percentage: calcPercentage(scores.TF, 'TF'),
      },
      JP: {
        label: type.includes('J') ? '判断 (J)' : '感知 (P)',
        percentage: calcPercentage(scores.JP, 'JP'),
      },
      AT: {
        label: type.includes('-A') ? '自信稳定 (A)' : '敏感动荡 (T)',
        percentage: calcPercentage(scores.AT, 'AT'),
      },
    };

    setResult(personalityResult);
    saveLatestResult(personalityResult);
  }, [answers]);

  const handleShare = async () => {
    if (!result) return;

    const shareText = `🎯 我的性格类型是：${result.type} - ${result.name}\n\n${result.description}\n\n维度分析：\n` +
      `• ${result.dimensions.EI.label}: ${result.dimensions.EI.percentage}%\n` +
      `• ${result.dimensions.SN.label}: ${result.dimensions.SN.percentage}%\n` +
      `• ${result.dimensions.TF.label}: ${result.dimensions.TF.percentage}%\n` +
      `• ${result.dimensions.JP.label}: ${result.dimensions.JP.percentage}%\n` +
      `• ${result.dimensions.AT.label}: ${result.dimensions.AT.percentage}%\n\n` +
      `快来测试你的性格类型吧！`;

    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(
          {
            mimeType: 'text/plain',
            data: shareText,
          } as any
        );
      } else {
        Alert.alert('提示', '该设备不支持分享功能');
      }
    } catch (error) {
      console.error('分享失败:', error);
      Alert.alert('提示', '分享失败，请重试');
    }
  };

  const handleRetake = () => {
    navigation.navigate('Home');
  };

  if (!result) return null;

  const dimensionEntries = Object.entries(result.dimensions) as [string, DimensionScore][];

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.header}>
          <Text style={styles.label}>你的性格类型</Text>
          <Text style={[styles.type, { color: themeColor }]}>{result.type}</Text>
          <Text style={styles.label}>代表角色</Text>
          <Text style={styles.name}>{result.name}</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{result.description}</Text>
        </View>

        <View style={styles.dimensionsContainer}>
          <Text style={styles.sectionTitle}>维度分析</Text>
          
          {dimensionEntries.map(([key, dimension]) => (
            <View key={key} style={styles.dimensionItem}>
              <View style={styles.dimensionHeader}>
                <Text style={styles.dimensionLabelLeft}>{dimension.label}</Text>
                <Text style={[styles.dimensionPercentage, { color: themeColor }]}>{dimension.percentage}%</Text>
              </View>
              <View style={styles.dimensionBar}>
                <View 
                  style={[
                    styles.dimensionFill, 
                    { width: `${Math.min(dimension.percentage, 100)}%`, backgroundColor: themeColor }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.shareButton, { backgroundColor: themeColor }]} onPress={handleShare}>
            <Text style={styles.shareButtonText}>分享结果</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.retakeButton, { borderColor: themeColor }]} onPress={handleRetake}>
            <Text style={[styles.retakeButtonText, { color: themeColor }]}>重新测试</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  navBackButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  navBackButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  navHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 40,
  },
  navPersonalitiesButton: {
    padding: theme.spacing.xs,
  },
  navPersonalitiesButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  type: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
  },
  descriptionCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.xl,
  },
  descriptionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.fontSize.md * 1.6,
    textAlign: 'center',
  },
  dimensionsContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  dimensionItem: {
    marginBottom: theme.spacing.lg,
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dimensionLabelLeft: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  dimensionBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  dimensionFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
  },
  dimensionPercentage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  shareButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },
  retakeButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
