import React from "react";
import { Text, View, Image } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: "https://i.ytimg.com/vi/2GNY4sDK5hY/mqdefault.jpg" }}
          style={{ width: 500, height: 500, marginRight: 20 }}
        />
        <Image
          source={{ uri: "https://pbs.twimg.com/ext_tw_video_thumb/1792372179990102017/pu/img/QG91FrbxbOjzQONO.jpg" }}
          style={{ width: 500, height: 500 }}
        />
      </View>
      <h2>Tngina ni Onecent</h2>
    </View>
  );
}