import React from 'react';
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
import { theme } from '../theme';
import { personalities, personalityGroups, PersonalityCard } from '../data/personalityCards';
import { RootStackParamList } from '../types';
import { hasLatestResult, getLatestResult } from '../utils/resultStorage';

type PersonalitiesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Personalities'>;

interface Props {
  navigation: PersonalitiesScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - theme.spacing.lg * 2 - CARD_MARGIN * 6) / 4;

function getGroupColor(group: string): string {
  return personalityGroups.find((g) => g.key === group)?.color || theme.colors.primary;
}

function PersonalityCardItem({ item }: { item: PersonalityCard }) {
  const groupColor = getGroupColor(item.group);

  return (
    <View style={[styles.card, { borderColor: groupColor + '40' }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: groupColor + '20' }]}>
        <Text style={[styles.imageText, { color: groupColor }]}>{item.key}</Text>
      </View>
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={[styles.cardKey, { color: groupColor }]}>{item.character}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>{item.shortDescription}</Text>
    </View>
  );
}

export default function PersonalitiesScreen({ navigation }: Props) {
  const groupedPersonalities = personalityGroups.map((group) => ({
    ...group,
    items: personalities.filter((p) => p.group === group.key),
  }));

  const handleViewResult = () => {
    if (hasLatestResult()) {
      const result = getLatestResult();
      if (result) {
        navigation.navigate('ResultView', { result });
      }
    } else {
      Alert.alert('提示', '还没有测试结果，请先完成测试');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content}>
        {groupedPersonalities.map((group) => (
          <View key={group.key} style={styles.groupSection}>
            <View style={styles.cardGrid}>
              {group.items.map((personality) => (
                <PersonalityCardItem key={personality.key} item={personality} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
    zIndex: 1,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    color: '#999999',
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
  viewResultButton: {
    padding: theme.spacing.xs,
  },
  viewResultButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  scrollArea: {
    height: height,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  groupSection: {
    marginBottom: theme.spacing.xl,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  groupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  groupTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: CARD_MARGIN,
    alignItems: 'center',
    borderWidth: 1,
  },
  imagePlaceholder: {
    width: CARD_WIDTH - theme.spacing.sm * 2,
    height: CARD_WIDTH - theme.spacing.sm * 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  imageText: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  cardName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  cardKey: {
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.xs * 1.4,
    textAlign: 'center',
  },
});
