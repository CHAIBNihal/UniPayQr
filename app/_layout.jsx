import { Redirect, router, Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import GlobalProvider, { useGlobalProvider } from "../Context/GlobalProvider";

export default function RootLayout() {

  const router = useRouter();

 

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
