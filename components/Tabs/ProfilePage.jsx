import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';


import { useGlobalProvider } from '../../Context/GlobalProvider';
import { supabase } from '../../lib/supabase'; // Assurez-vous d'importer supabase
import Avatar from "../Uploads/Avatar"
const ProfilePage = () => {

  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { sessionContext, setSessionContext, loading, setLoading, active, setname } = useGlobalProvider();

  useEffect(() => {
    if (sessionContext) getProfile();
  }, [sessionContext]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!sessionContext?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username ,website, avatar_url')
        .eq('id', sessionContext?.user.id)
        .single();


      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setname(data.username)
        setAvatarUrl(data.avatar_url);
        setPassword(data.password)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      if (!sessionContext?.user) throw new Error('No user on the session!');
      console.log("user id", sessionContext?.user?.id)

      const updates = {
        id: sessionContext?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      const { error: profileError } = await supabase.from('profiles').upsert(updates);
      if (profileError) throw profileError;

      const newPassword = password.trim()

      // Mise à jour du mot de passe si un nouveau mot de passe est fourni
      if (newPassword) {

        const { error: passwordError } = await supabase.auth.updateUser({
          password,
        });
        if (passwordError) throw passwordError;
      }

      Alert.alert('Profile and password updated successfully!');


    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    setSessionContext("")

  }
  const handleRefresh = async () => {
    setRefreshing(true);
    await getSessionData()
    setRefreshing(false);
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} className="bg-white h-full">
      <SafeAreaView className="mt-10 py-2 mx-4 px-7">
        {/* Header */}
        <View className="bg-gray-300 px-3 py-5 shadow-lg shadow-gray-400 rounded-3xl">
          <View className="flex-row justify-between items-center px-2">
            <TouchableOpacity
              className="bg-gray-200 p-2 rounded-tl-lg rounded-br-lg"
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon color="black" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
              <AntDesign name="logout" size={26} color="black" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View className="items-center mt-3 relative">
            <View className="relative">
              <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url) => {
                  setAvatarUrl(url)
                  updateProfile({ username, avatar_url: url })
                }}
              />

            </View>

            <Text className="text-xl font-semibold mt-2 text-gray-800">
              {sessionContext?.user?.email}
            </Text>
            {active ? (
              <Text className="text-green-500 text-lg font-semibold">
                Active Acount
              </Text>
            ) : (
              <Text className="text-red-500 text-lg font-semibold">Your Account is not active</Text>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Options Section */}
      <View className="p-4">

        {/* Personal Information */}
        <View className="mt-6 px-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Personal Information
          </Text>

          {/* Username Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Username</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg"
              value={username || ""}
              onChangeText={(text) => {
                console.log("User name ", username)
                setUsername(text)
              }

              }
            />
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg"
              value={sessionContext?.user?.email}
              editable={false}
            />
          </View>

          {/* Password Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <TextInput
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              className="bg-gray-100 p-3 rounded-lg"
              value={password || ""}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-black py-3 rounded-xl mb-3"
            onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
            disabled={loading}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {loading ? 'Updaing...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
