import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import "../global.css";
import { use, useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";

Sentry.init({
  dsn: 'https://f94108638868e1de937f3d4e7453f799@o4510646484664320.ingest.de.sentry.io/4510646486237264',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const{isLoading,fetchAuthenticatedUser}=useAuthStore();
  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });
 
  useEffect(()=>{
      if(error) throw error;
      if(fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded,error]);

  useEffect(()=>{
    fetchAuthenticatedUser()
  },[]);

  if(!fontsLoaded||isLoading) return null;
  return <Stack screenOptions={{headerShown:false}} />;
});