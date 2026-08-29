import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import images from "@/constants/images";
import { posthog } from "@/lib/posthog";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { signOut } = useClerk();
  const { user } = useUser();

  async function handleSignOut() {
    try {
      posthog?.capture("user_signed_out");
      await signOut();
    } catch (err) {
      console.error("Sign-out failed: ", err);
    }
  }

  const email = user?.emailAddresses[0].emailAddress;
  const displayName = user?.firstName || user?.fullName || email || "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary mb-6">
        Settings
      </Text>

      <View className="auth-card mb-5">
        <View className="flex-row items-center gap-4 mb-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">
              {displayName}
            </Text>
            {email && (
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {email}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="auth-card mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">
          Account
        </Text>
        <View className="gap-2">
          <Text className="text-sm font-sans-medium text-muted-foreground">
            Account ID
          </Text>
          <Text
            className="text-sm font-sans-medium text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.id.substring(0, 20)}...
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm font-sans-medium text-muted-foreground">
            Joined
          </Text>
          <Text className="text-sm font-sans-medium text-primary">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
        </View>
      </View>

      <Pressable className="auth-button bg-destructive" onPress={handleSignOut}>
        <Text className="auth-button-text text-white">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
