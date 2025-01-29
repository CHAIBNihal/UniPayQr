import { StatusBar } from "expo-status-bar";
import { Image, Text, TouchableOpacity, View } from "react-native";
import "../global.css"
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 flex justify-around my-4 ">
        <Text className="text-4xl text-gray-700 font-bold text-center ">UniPayQr</Text>
        <Text className="text-center text-lg font-bold  ">Get You challan by Click Now! </Text>
        <View className="flex-row justify-center">
          <Image source={require("../assets/images/online.png")}
            style={{ width: 420, height: 270 }}
          />
        </View>
        <View className="space-y-4">
          <TouchableOpacity onPress={() => router.push("/sign-up")}
            className="p-3 bg-yellow-600 mx-7 rounded-xl">
            <Text className=" font-bold  text-center text-black text-3xl  ">Sign Up </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-2">
            <Text className="text-lg font-bold text-gray-700 ">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-lg font-bold text-second underline ">Log In</Text>
            </TouchableOpacity>

          </View>
        </View>

      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
