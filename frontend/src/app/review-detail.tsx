import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReviewDetailScreen() {
  const params = useLocalSearchParams<{ title?: string }>();
  const insets = useSafeAreaInsets();

  const title = params.title ?? "Safety Report";
  const score = 22;

  return (
    <View className="flex-1 bg-[#F9F7F2]">
      {/* header */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </Pressable>
        <Text
          className="text-lg font-bold text-[#1A202C]"
          style={{ fontFamily: "SpaceGrotesk_700Bold" }}
        >
          {title}
        </Text>
        {/* empty view for spacing */}
        <View className="w-10 h-10" />
        {/** @TODO quality of life feature */}
        {/* <Pressable className="p-2">
          <Ionicons name="share-outline" size={24} color="#1A202C" />
        </Pressable> */}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* score circle */}
        <View className="items-center my-8">
          <View className="relative">
            <View className="w-40 h-40 rounded-full bg-[#B8E6E0] items-center justify-center">
              <View className="w-32 h-32 rounded-full bg-[#D4EDE8] items-center justify-center">
                <View className="absolute -top-1">
                  <Ionicons name="shield-checkmark" size={20} color="#166534" />
                </View>
                <Text
                  className="text-4xl font-bold text-[#166534]"
                  style={{ fontFamily: "SpaceGrotesk_700Bold" }}
                >
                  {score}
                </Text>
                <Text className="text-sm text-gray-500">/ 100</Text>
              </View>
            </View>
          </View>
          <Text
            className="text-lg font-bold text-[#1A202C] mt-4 mb-2"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            High Risk Detected
          </Text>
          <Text className="text-base text-gray-500 text-center px-4">
            Content exhibits strong indicators of bias and low factual
            reliability.
          </Text>
        </View>

        {/* factual claims card */}
        <View className="rounded-2xl p-5 mb-4 bg-white shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center">
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
              </View>
              <Text
                className="text-base font-bold text-[#1A202C]"
                style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
              >
                Factual Claims
              </Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-red-100">
              <Text className="text-xs font-semibold text-red-600">
                3 Flags
              </Text>
            </View>
          </View>
          <View className="gap-3">
            <View className="flex-row gap-3">
              <Ionicons name="close-circle" size={20} color="#DC2626" />
              <Text className="flex-1 text-sm text-gray-600">
                Claims about "90% success rate" lack citation.
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Ionicons name="warning" size={20} color="#EAB308" />
              <Text className="flex-1 text-sm text-gray-600">
                Quote taken from 2018 study, not 2024.
              </Text>
            </View>
          </View>
        </View>

        {/* confidence gap + cognitive bias row */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 rounded-2xl p-5 bg-[#FEF9E0]">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="pulse" size={18} color="#92400E" />
              <Text
                className="text-sm font-bold text-[#1A202C]"
                style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
              >
                Confidence Gap
              </Text>
            </View>
            <View className="flex-row items-end gap-2 h-16">
              <View className="flex-1 items-center">
                <View
                  className="w-full rounded-t bg-amber-300"
                  style={{ height: 24 }}
                />
                <Text className="text-xs text-gray-500 mt-1">SOURCE</Text>
              </View>
              <View className="flex-1 items-center">
                <View
                  className="w-full rounded-t bg-amber-400"
                  style={{ height: 40 }}
                />
                <Text className="text-xs text-gray-500 mt-1">FACT</Text>
              </View>
              <View className="flex-1 items-center">
                <View
                  className="w-full rounded-t bg-gray-300"
                  style={{ height: 56 }}
                />
                <Text className="text-xs text-gray-500 mt-1">AVG</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 rounded-2xl p-5 bg-[#FFE4E4]">
            <View className="w-10 h-10 rounded-full bg-red-200/60 items-center justify-center mb-3">
              <Ionicons name="people" size={20} color="#DC2626" />
            </View>
            <Text
              className="text-base font-bold text-[#1A202C] mb-2"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              Cognitive Bias
            </Text>
            <Text className="text-sm text-gray-600">
              Strong{" "}
              <Text className="font-semibold text-red-600">
                Confirmation Bias
              </Text>{" "}
              detected in phrasing.
            </Text>
          </View>
        </View>

        {/* source analysis card */}
        <View className="rounded-2xl p-5 mb-8 bg-white shadow-sm">
          <Text className="text-xs text-gray-400 text-right mb-3">
            Analyzed 2m ago
          </Text>
          <View className="flex-row items-start gap-4">
            <View className="relative">
              <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
                <Ionicons name="logo-instagram" size={28} color="#E4405F" />
              </View>
              <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-xs font-bold text-white">1</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-bold text-[#1A202C] mb-1"
                style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
              >
                Viral News Daily
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                Known for sensationalist headlines.
              </Text>
              <Pressable className="self-start px-4 py-2 rounded-xl bg-gray-800">
                <Text className="text-sm font-medium text-white">Details</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* generate summary button */}
        {/** @TODO add actual button action functionality */}
        <Pressable className="rounded-2xl py-4 bg-[#1A202C] flex-row items-center justify-center gap-2 active:opacity-90">
          <Ionicons name="document-text" size={22} color="white" />
          <Text
            className="text-base font-semibold text-white"
            style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
          >
            Generate Summary
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
