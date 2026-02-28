import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReviewGlimpseScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    tag?: string;
    source?: string;
  }>();
  const insets = useSafeAreaInsets();

  const title = params.title ?? "Medical Advice Scan Results";
  const source = params.source ?? "Instagram Analysis";
  const riskLevel = params.tag === "SAFE" ? "Low Risk" : "High Risk";
  const severityScore = params.tag === "SAFE" ? 12 : 88;
  const aiConfidence = params.tag === "SAFE" ? 95 : 92;
  const riskColor = params.tag === "SAFE" ? "#16A34A" : "#DC2626";

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
        <View className="flex-row gap-4">
          {/** @TODO quality of life feature */}
          {/* <Pressable className="p-2">
            <Ionicons name="share-outline" size={24} color="#1A202C" />
          </Pressable> */}
          {/** @TODO quality of life feature */}
          {/* <Pressable className="p-2">
            <Ionicons name="bookmark" size={24} color="#1A202C" />
          </Pressable> */}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* tags */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View className="px-3 py-1.5 rounded-lg bg-[#E8E0F0]">
            <Text className="text-xs font-medium text-[#6B5B95] uppercase">
              {source}
            </Text>
          </View>
          <View className="px-3 py-1.5 rounded-lg bg-[#E8E0F0]">
            <Text className="text-xs font-medium text-[#6B5B95]">Just now</Text>
          </View>
        </View>

        {/* title */}
        <Text
          className="text-2xl font-bold text-[#1A202C] mb-6"
          style={{ fontFamily: "SpaceGrotesk_700Bold" }}
        >
          {title}
        </Text>

        {/* risk level card */}
        <View className="rounded-2xl p-5 mb-6 bg-[#FFE4E4]">
          <Text className="text-xs font-medium text-[#9B6B6B] uppercase mb-2">
            Risk Level
          </Text>
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-xl font-bold"
              style={{ color: riskColor, fontFamily: "SpaceGrotesk_700Bold" }}
            >
              {riskLevel}
            </Text>
            <View className="w-8 h-8 rounded-full items-center justify-center bg-white/80">
              <Ionicons name="warning" size={18} color={riskColor} />
            </View>
          </View>
          <Text className="text-sm text-gray-600 mb-4">
            Content contains unverified claims about holistic cancer treatments.
          </Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-xs font-medium text-[#9B6B6B] uppercase">
              Severity Score
            </Text>
            <View className="flex-1 h-2 rounded-full bg-white/80 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${severityScore}%`,
                  backgroundColor: riskColor,
                }}
              />
            </View>
            <Text
              className="text-sm font-bold"
              style={{ color: riskColor, fontFamily: "SpaceGrotesk_700Bold" }}
            >
              {severityScore}%
            </Text>
          </View>
        </View>

        {/* two column cards */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 rounded-2xl p-5 bg-[#FEF9E0]">
            <View className="w-12 h-12 rounded-full bg-amber-200/60 items-center justify-center mb-3">
              <Ionicons name="construct" size={24} color="#92400E" />
            </View>
            <Text
              className="text-2xl font-bold text-[#1A202C] mb-1"
              style={{ fontFamily: "SpaceGrotesk_700Bold" }}
            >
              {aiConfidence}%
            </Text>
            <Text className="text-sm font-semibold text-[#1A202C] mb-1">
              AI Confidence
            </Text>
            <Text className="text-xs text-gray-600">
              Based on 14 reliable medical sources.
            </Text>
          </View>

          <View className="flex-1 rounded-2xl p-5 bg-[#E8E0F0] overflow-hidden">
            <View className="absolute right-0 top-0 w-20 h-20 opacity-20">
              <View className="flex-row">
                {[...Array(4)].map((_, i) => (
                  <View
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-purple-400"
                    style={{ marginRight: 4, marginBottom: 4 }}
                  />
                ))}
              </View>
            </View>
            <View className="w-12 h-12 rounded-lg bg-purple-200/60 items-center justify-center mb-3">
              <Ionicons name="document-text" size={24} color="#6B5B95" />
            </View>
            <Text className="text-sm font-semibold text-[#1A202C] mb-2">
              Source Check
            </Text>
            <Text className="text-xs text-gray-600">
              Original poster has history of flagged content.
            </Text>
          </View>
        </View>

        {/* view full report button */}
        <Link
          href={{
            pathname: "/review-detail",
            params: { title: "Safety Report" },
          }}
          asChild
        >
          <Pressable className="rounded-2xl py-4 bg-[#1A202C] flex-row items-center justify-center gap-2 active:opacity-90">
            <Text
              className="text-base font-semibold text-white"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              View Full Report
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
