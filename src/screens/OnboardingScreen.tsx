import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import { useSettings } from '../context/SettingsContext';
import MosqueIllustration from '../components/illustrations/MosqueIllustration';
import LanternIllustration from '../components/illustrations/LanternIllustration';
import PlantIllustration from '../components/illustrations/PlantIllustration';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: 'checkmark-circle', title: 'Tap to count', sub: 'Keep track of your zikr easily' },
  { icon: 'create', title: 'Add Custom Zikr', sub: 'Create your own list' },
  { icon: 'stats-chart', title: 'History & Stats', sub: 'Track your progress' },
  { icon: 'alarm', title: 'Set Reminders', sub: 'Never miss your daily zikr' },
] as const;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { completeOnboarding } = useSettings();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const goNext = () => {
    if (page < 2) {
      scrollRef.current?.scrollTo({ x: width * (page + 1), animated: true });
      setPage(page + 1);
    } else {
      completeOnboarding();
      navigation.replace('Language');
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(idx);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEnabled={false}
      >
        <View style={[styles.page, { width }]}>
          <View style={styles.illustration}>
            <MosqueIllustration width={140} height={112} />
          </View>
          <Text style={styles.title}>Begin your journey of{'\n'}Zikr & Tashbi</Text>
          <Text style={styles.subtitle}>Simple, Beautiful, Meaningful.</Text>
        </View>

        <View style={[styles.page, { width }]}>
          <Text style={styles.title}>Track your Zikr</Text>
          <Text style={styles.subtitle}>Small deeds, big rewards</Text>
          <View style={styles.featureList}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={20} color={palette.deepGreen} />
                </View>
                <View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.page, { width }]}>
          <View style={styles.archWrap}>
            <View style={styles.archTop} />
            <LanternIllustration width={70} height={110} />
            <View style={styles.archPlants}>
              <PlantIllustration width={44} height={56} />
              <PlantIllustration width={44} height={56} flip />
            </View>
          </View>
          <Text style={styles.title}>Stay Consistent</Text>
          <Text style={styles.subtitle}>Small deeds, big rewards</Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quote}>
              "Indeed, in the remembrance of Allah do hearts find rest."
            </Text>
            <Text style={styles.quoteRef}>(Ar-Ra'd 13:28)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
        ))}
      </View>

      <PrimaryButton
        title={page === 2 ? 'Get Started' : 'Next'}
        onPress={goNext}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
    paddingTop: 80,
  },
  page: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: palette.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  archWrap: {
    width: 200,
    height: 190,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  archTop: {
    position: 'absolute',
    top: 0,
    width: 160,
    height: 160,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderWidth: 3,
    borderColor: palette.gold,
    borderBottomWidth: 0,
    backgroundColor: palette.creamDark,
  },
  archPlants: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.deepGreen,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: palette.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureList: {
    width: '100%',
    marginTop: 20,
    gap: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.textDark,
  },
  featureSub: {
    fontSize: 12,
    color: palette.textMuted,
    marginTop: 2,
  },
  quoteBox: {
    backgroundColor: palette.creamDark,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  quote: {
    fontSize: 14,
    color: palette.textDark,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteRef: {
    fontSize: 12,
    color: palette.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 24,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.creamDark,
  },
  dotActive: {
    backgroundColor: palette.gold,
    width: 20,
  },
  button: {
    marginHorizontal: 28,
    marginBottom: 32,
    backgroundColor: palette.deepGreen,
  },
});

export default OnboardingScreen;
