import {
  SplashScreen,
  Stack,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
  PostHogErrorBoundary,
  PostHogProvider,
  usePostHog,
} from "posthog-react-native";
import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey)
  throw new Error("Add your Clerk publishable Key to the .env");

function PostHogIdentity() {
  const posthogClient = usePostHog();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const identifiedUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    if (!isSignedIn || !user) {
      if (identifiedUserId.current) {
        posthogClient.reset();
        identifiedUserId.current = undefined;
      }
      return;
    }

    if (identifiedUserId.current === user.id) return;

    if (identifiedUserId.current) {
      posthogClient.reset();
    }

    const email = user.primaryEmailAddress?.emailAddress;
    posthogClient.identify(user.id, {
      $set: {
        ...(email ? { email } : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
    identifiedUserId.current = user.id;
  }, [authLoaded, isSignedIn, posthogClient, user, userLoaded]);

  return null;
}

function RootLayoutCountent() {
  const { isLoaded: authLoaded } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Filter route params to avoid leaking sensitive data
      const sanitizedParams = Object.keys(params).reduce(
        (acc, key) => {
          // Only include specific safe params
          if (["id", "tab", "view"].includes(key)) {
            acc[key] = params[key];
          }
          return acc;
        },
        {} as Record<string, string | string[]>,
      );

      posthog?.screen(pathname, {
        previout_screen: previousPathname.current ?? null,
        ...sanitizedParams,
      });

      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded]);

  if (!fontsLoaded || !authLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const content = <RootLayoutCountent />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogIdentity />
          <PostHogErrorBoundary>{content}</PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        content
      )}
    </ClerkProvider>
  );
}
