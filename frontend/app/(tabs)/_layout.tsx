import { Tabs } from "expo-router"

export default () => {
    return(
        <Tabs>
             <Tabs.Screen
        name="scan"
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
            <Tabs.Screen name="home"/>
            <Tabs.Screen name="list"/>
        </Tabs>
    )
}
