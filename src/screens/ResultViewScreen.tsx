import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { theme } from '../theme';
import { getPersonalityResult } from '../data/personalities';
import { RootStackParamList, PersonalityResult, DimensionScore } from '../types';
import { saveLatestResult, getLatestResult, hasLatestResult } from '../utils/resultStorage';

type ResultViewNavigationProp = StackNavigationProp<RootStackParamList, 'ResultView'>;
type ResultViewRouteProp = RouteProp<RootStackParamList, 'ResultView'>;

interface Props {
  navigation: ResultViewNavigationProp;
  route: ResultViewRouteProp;
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

export default function ResultViewScreen({ navigation, route }: Props) {
  const { result: initialResult } = route.params;
  const [result, setResult] = useState<PersonalityResult | null>(initialResult || getLatestResult());
  const [themeColor, setThemeColor] = useState(() => {
    const r = initialResult || getLatestResult();
    return r ? getPersonalityColor(r.type) : theme.colors.primary;
  });

  useEffect(() => {
    const r = initialResult || getLatestResult();
    if (r) {
      setResult(r);
      setThemeColor(getPersonalityColor(r.type));
    }
  }, []);

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
        await Sharing.shareAsync({ mimeType: 'text/plain', data: shareText } as any);
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.resultHeader}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  resultHeader: {
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
