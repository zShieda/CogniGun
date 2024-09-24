import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="LandingPage"/>
    </Stack>
  );
};

export default StackLayout;
