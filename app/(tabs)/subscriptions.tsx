import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState } from "react";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { SubscriptionCard } from "@/components/subscription-card";

const SafeAreaView = styled(RNSafeAreaView);

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      subscription.category
        ?.toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      subscription.plan?.includes(searchQuery.toLocaleLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="text-3xl font-bold text-primary mb-5">
              Subscriptions
            </Text>
            <TextInput
              className="bg-card rounded-xl px-4 py-3 text-primary mb-4"
              placeholder="Search subscriptions..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}
