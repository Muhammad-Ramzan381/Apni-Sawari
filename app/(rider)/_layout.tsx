import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function RiderLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E96E5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("rider.rideHistory"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t("rider.wallet"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("rider.profile"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>👤</Text>,
        }}
      />
      {/* Hidden screens - not shown in tabs */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="select-vehicle" options={{ href: null }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="tracking" options={{ href: null }} />
      <Tabs.Screen name="rating" options={{ href: null }} />
      <Tabs.Screen name="rewards" options={{ href: null }} />
    </Tabs>
  );
}
