import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CardTag = 'HIGH RISK' | 'MISINFO' | 'BIAS' | 'SCAM' | 'SAFE';

type ContentCardProps = {
  tag: CardTag;
  title: string;
  description: string;
  score?: number;
  backgroundColor: string;
  onPress?: () => void;
};

const TAG_ICONS: Record<CardTag, keyof typeof Ionicons.glyphMap> = {
  'HIGH RISK': 'warning',
  MISINFO: 'alert-circle',
  BIAS: 'bar-chart',
  SCAM: 'card-outline',
  SAFE: 'shield-checkmark',
};

export function ContentCard({
  tag,
  title,
  description,
  score,
  backgroundColor,
  onPress,
}: ContentCardProps) {
  const IconComponent = TAG_ICONS[tag];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4 flex-1 min-w-0 active:opacity-95"
      style={{ backgroundColor, minHeight: 140 }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <View className="flex-row items-center gap-1.5 px-2 py-1 rounded-full bg-white/60">
          <Ionicons name={IconComponent} size={12} color="#374151" />
          <Text className="text-xs font-medium text-gray-700">{tag}</Text>
        </View>
      </View>
      <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
        {title}
      </Text>
      <Text
        className="text-sm text-gray-600 leading-5"
        numberOfLines={2}
      >
        {description}
      </Text>
      {score !== undefined && (
        <View className="absolute bottom-4 right-4">
          <Text className="text-sm font-semibold text-gray-700">{score}%</Text>
        </View>
      )}
    </Pressable>
  );
}
