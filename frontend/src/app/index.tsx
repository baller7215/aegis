import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AddSourceModal } from '@/components/add-source-modal';
import { CategoryFilters } from '@/components/category-filters';
import { ContentCard } from '@/components/content-card';
import { Header } from '@/components/header';

/** @TODO replace w actual data (define card categories / types each w their own color) */
const MOCK_CARDS = [
  {
    tag: 'HIGH RISK' as const,
    title: 'Deepfake Alert',
    description: 'Influencer scam detected in video...',
    backgroundColor: '#E8E0F0',
    fullWidth: false,
  },
  {
    tag: 'MISINFO' as const,
    title: 'Supplements',
    description: 'Unverified health advice in thread...',
    backgroundColor: '#D4EDE0',
    fullWidth: false,
  },
  {
    tag: 'BIAS' as const,
    title: 'Election Forecast Analysis',
    description:
      'Source demonstrates strong partisan language and selective...',
    score: 70,
    backgroundColor: '#FEF9E0',
    fullWidth: true,
  },
  {
    tag: 'SCAM' as const,
    title: 'Crypto Scheme',
    description: 'Promises unrealistic...',
    backgroundColor: '#FFE4E0',
    fullWidth: false,
  },
  {
    tag: 'SAFE' as const,
    title: 'Job Posting here',
    description: 'Verified company profile...',
    backgroundColor: '#F5F5F5',
    fullWidth: false,
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const addSourceRef = useRef<BottomSheetModal>(null);

  return (
    <View className="flex-1 bg-[#F9F7F2]">
      <Header onAddPress={() => addSourceRef.current?.present()} />
      <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap" style={{ gap: 16 }}>
          {MOCK_CARDS.map((card, index) => (
            <View
              key={index}
              // full width if true, otherwise 47%
              style={{ width: card.fullWidth ? '100%' : '47%' }}
            >
              <ContentCard
                tag={card.tag}
                title={card.title}
                description={card.description}
                score={card.score}
                backgroundColor={card.backgroundColor}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <AddSourceModal ref={addSourceRef} />
    </View>
  );
}
