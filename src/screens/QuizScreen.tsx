import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { questions } from '../data/questions';
import { AnswerRecord, RootStackParamList } from '../types';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

interface Props {
  navigation: QuizScreenNavigationProp;
}

const CIRCLE_GAP = 10;

export default function QuizScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const circles = [
    { value: 3, size: 50 },
    { value: 2, size: 42 },
    { value: 1, size: 34 },
    { value: 0, size: 26 },
    { value: -1, size: 34 },
    { value: -2, size: 42 },
    { value: -3, size: 50 },
  ];

  const handleSelect = (value: number) => {
    setSelectedValue(value);

    setTimeout(() => {
      const newAnswer: AnswerRecord = {
        questionId: question.id,
        value,
        dimension: question.dimension,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setSelectedValue(null);

      if (currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 200);
      } else {
        setTimeout(() => {
          navigation.navigate('Result', { answers: updatedAnswers });
        }, 200);
      }
    }, 300);
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      const updatedAnswers = answers.slice(0, -1);
      setAnswers(updatedAnswers);
      setSelectedValue(null);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getCircleColor = (value: number): string => {
    if (value > 0) return theme.colors.success;
    if (value < 0) return '#9B59B6';
    return theme.colors.border;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.circlesWrapper}>
            {circles.map((circle, index) => {
              const circleSize = circle.size;
              const circleColor = getCircleColor(circle.value);
              const isSelected = selectedValue === circle.value;
              const maxSize = 50;

              return (
                <View
                  key={index}
                  style={{ height: maxSize, justifyContent: 'center', alignItems: 'center', marginHorizontal: CIRCLE_GAP / 2 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.circle,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        borderWidth: isSelected ? 4 : 2,
                        borderColor: circleColor,
                        backgroundColor: isSelected ? circleColor + '30' : 'transparent',
                      },
                    ]}
                    onPress={() => handleSelect(circle.value)}
                    activeOpacity={0.7}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>上一题</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hintText}>点击圆形选项进行选择</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    flexGrow: 1,
  },
  questionCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xxl,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: theme.fontSize.xl * 1.5,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  circlesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
});
