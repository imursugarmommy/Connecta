import React from "react";
import { Text, View } from "react-native";

export default function Divider({
  text = "",
  orientation,
}: {
  text?: string;
  orientation: "horizontal" | "vertical";
}) {
  const isHorizontal = orientation === "horizontal";
  return (
    <View
      className="items-center justify-center flex-grow"
      style={{
        width: isHorizontal ? "100%" : "auto",
        height: isHorizontal ? "auto" : "100%",
        flexDirection: isHorizontal ? "row" : "column",
        marginVertical: isHorizontal ? 8 : 0,
        marginHorizontal: isHorizontal ? 0 : 8,
      }}>
      <View
        className="flex-grow rounded-xl bg-gray-200"
        style={{
          height: isHorizontal ? 1 : 0,
          width: isHorizontal ? 0 : 1,
          flexDirection: isHorizontal ? "row" : "column",
        }}
      />
      {text !== "" && (
        <Text
          className="text-gray-300"
          style={{
            marginHorizontal: isHorizontal ? 8 : 0,
            marginVertical: isHorizontal ? 0 : 8,
          }}>
          {text}
        </Text>
      )}
      {text !== "" && (
        <View
          className="flex-grow rounded-xl bg-gray-200"
          style={{
            height: isHorizontal ? 1 : 0,
            width: isHorizontal ? 0 : 1,
          }}
        />
      )}
    </View>
  );
}
