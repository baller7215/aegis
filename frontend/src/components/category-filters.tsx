import { Pressable, ScrollView, Text } from 'react-native';

const CATEGORIES = ['All', 'High Risk', 'Medical', 'Finance', 'Politics', 'Social'];

type CategoryFiltersProps = {
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
        alignItems: 'center',
      }}
      style={{ maxHeight: 48 }}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selected === category;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            className={`px-4 py-2 rounded-full active:opacity-80 ${
              isSelected ? 'bg-black' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-black'
              }`}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
