import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="Register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default StackLayout;