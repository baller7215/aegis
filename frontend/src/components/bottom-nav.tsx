import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NAV_ITEMS = [
  { id: 'home', icon: 'home' as const, iconOutline: 'home-outline' as const, active: true },
  { id: 'globe', icon: 'globe' as const, iconOutline: 'globe-outline' as const, active: false },
  { id: 'history', icon: 'refresh' as const, iconOutline: 'refresh' as const, active: false },
  { id: 'profile', icon: 'person' as const, iconOutline: 'person-outline' as const, active: false },
] as const;

export function BottomNav() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center px-4 pb-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <View className="flex-row items-center justify-around w-full max-w-md rounded-full bg-gray-800 py-3 px-6">
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {}}
            className="w-12 h-12 rounded-full items-center justify-center active:opacity-80"
            style={item.active ? { backgroundColor: 'rgba(255,255,255,0.2)' } : undefined}
          >
            <Ionicons
              name={item.active ? item.icon : item.iconOutline}
              size={24}
              color="white"
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
