import { Text, TouchableOpacity, View } from "react-native";

export function ListHeading({ title }: ListHeadingProps) {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity className="list-action">
        <Text>View All</Text>
      </TouchableOpacity>
    </View>
  );
}
