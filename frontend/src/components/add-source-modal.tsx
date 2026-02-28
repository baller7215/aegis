import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type AddSourceModalRef = BottomSheetModal;

export const AddSourceModal = React.forwardRef<BottomSheetModal>(
  function AddSourceModal(_, ref) {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['50%'], []);

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    const handleLinkPress = useCallback(() => {
      (ref as React.RefObject<BottomSheetModal | null>)?.current?.dismiss();
      /** @TODO handle link action */
    }, [ref]);

    const handleUploadPress = useCallback(() => {
      (ref as React.RefObject<BottomSheetModal | null>)?.current?.dismiss();
      /** @TODO handle upload action */
    }, [ref]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        backgroundStyle={{
          backgroundColor: '#F8F7F4',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <BottomSheetView
          className="flex-1 px-6 pt-2"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Text
            className="text-2xl font-bold text-center text-[#1A202C] mb-2"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            Add Source
          </Text>
          <Text className="text-base text-center text-[#7B7B7B] mb-8">
            Import any photo or link you want to analyze for safety.
          </Text>

          <View className="flex-row gap-4">
            <Pressable
              onPress={handleLinkPress}
              className="flex-1 rounded-2xl p-6 items-center justify-center bg-[#EFEBE6] active:opacity-90"
            >
              <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-3">
                <Ionicons name="link" size={24} color="#1A202C" />
              </View>
              <Text
                className="text-lg font-semibold text-[#1A202C]"
                style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
              >
                Link
              </Text>
            </Pressable>

            <Pressable
              onPress={handleUploadPress}
              className="flex-1 rounded-2xl p-6 items-center justify-center bg-[#1A202C] active:opacity-90"
            >
              <View className="w-14 h-14 rounded-full bg-[#2D3748] items-center justify-center mb-3">
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color="white"
                />
              </View>
              <Text
                className="text-lg font-semibold text-white"
                style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
              >
                Upload
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
