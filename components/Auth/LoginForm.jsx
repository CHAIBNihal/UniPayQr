import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import { supabase } from "../../lib/supabase";
import { useGlobalProvider } from "../../Context/GlobalProvider";

const LoginForm = () => {
  // Navigation
  const navigation = useNavigation();

  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Context from GlobalProvider
  const {
    setLogged,
    setSessionContext,
    setLoading,
    loading,

  } = useGlobalProvider();

  // Helper variables
  const email = form.email.trim();
  const password = form.password.trim();
  // Handlers
  const isValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError("Both fields are required.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError(""); // Clear errors if all validations pass
    return true;
  };

  // Handle form submission
  const onSubmit = async () => {
    if (!isValid()) return; 

    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        setError(error.message);
        return;
      }

      setLogged(true);
      setSessionContext(data.session);

      // console.log("Login successful: data session context", data.session);
      router.push("/home");
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View className="bg-second flex-1">
        <SafeAreaView className="flex">
          {/* Back button */}
          <View className="flex-row justify-start mb-4 p-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftIcon color="black" size={20} />
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View className="flex-row justify-center">
            <Image
              source={require("../../assets/images/online-wom.png")}
              style={{ height: 180, width: 400 }}
            />
          </View>
        </SafeAreaView>

        {/* Form container */}
        <View
          className="bg-white px-8 pt-10 mt-5 h-screen flex-1"
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <Text className="text-4xl text-gray-700 font-bold text-center">
            Sign-In
          </Text>

          {/* Error message */}
          {error ? (
            <Text className="text-red-700 font-semibold text-center text-lg mt-3 p-2">
              {error}
            </Text>
          ) : null}

          {/* Form fields */}
          <View className="form mt-4 space-y-2 p-2">
            <Text className="text-gray-700 text-lg font-semibold ml-4 mb-2">
              Email Address
            </Text>
            <TextInput
              className="text-gray-700 bg-gray-100 rounded-2xl p-4 mb-2"
              value={form.email}
              onChangeText={(e) => setForm({ ...form, email: e })}
              autoCapitalize="none"
              placeholder="Enter Email"
              keyboardType="email-address"
            />

            <Text className="text-gray-700 text-lg font-semibold ml-4 mb-2">
              Password
            </Text>
            <TextInput
              className="text-gray-700 bg-gray-100 rounded-2xl p-4 mb-2"
              value={form.password}
              onChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Enter Password"
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-end flex mb-3"
              onPress={() => router.push("/forgot")}
            >
              <Text className="text-xl text-gray-700 font-bold">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={onSubmit}
              className="p-4 w-3/2 bg-second rounded-2xl mt-3"
              disabled={loading}
            >
              <Text className="text-xl text-center font-semibold text-gray-700">
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            {/* Sign-Up Link */}
            <View className="flex-row mb-2 ml-4">
              <Text className="text-lg text-gray-700">
                You don't have an account?
              </Text>
              <TouchableOpacity
                className="ml-2"
                onPress={() => router.push("/sign-up")}
              >
                <Text className="text-lg font-semibold underline text-gray-700">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginForm;
