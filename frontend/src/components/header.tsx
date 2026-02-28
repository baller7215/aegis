import { ShieldPlus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  onAddPress?: () => void;
};

export function Header({ onAddPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-4 bg-[#F9F7F2]"
      // safe area padding
      style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
    >
      <View className="flex-row items-center gap-2">
        <View className="w-10 h-10 rounded-full bg-black items-center justify-center">
          <ShieldPlus color="white" size={24} strokeWidth={2.5} />
        </View>
        <Text
          className="text-3xl text-[#1A1A1A]"
          style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
        >
          aegis
        </Text>
      </View>
      <Pressable
        className="w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center active:opacity-80"
        onPress={onAddPress}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}
