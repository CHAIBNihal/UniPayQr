import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Cards from '../Cards';
import { useGlobalProvider } from '../../Context/GlobalProvider';
import { supabase } from '../../lib/supabase'; // Assurez-vous d'importer supabase

const ProfilePage = () => {

  const navigation = useNavigation();

  const [username, setUsername] = useState('');  
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState("");

  const { sessionContext, loading, setLoading } = useGlobalProvider();

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

  return (
    <ScrollView className="bg-white h-full">
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
            <TouchableOpacity onPress={() =>  supabase.auth.signOut()
            }>
              <AntDesign name="logout" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View className="items-center mt-3 relative">
            <View className="relative">
              <Image
                source={{ uri: avatarUrl || 'https://example.com/default-avatar.png' }} // Utilisez un avatar par défaut si aucune URL
                className="rounded-full shadow-gray-400 shadow-xl"
                style={{ width: 100, height: 100 }}
              />
              <TouchableOpacity>
                <Feather name="edit-3" size={20} color="black" className="bottom-7 left-20" />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-semibold mt-2 text-gray-800">
              {sessionContext?.user?.email}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Options Section */}
      <View className="p-4">
        <Cards
          title="Print your receipt"
          direction={() => router.push('/challan')}
          color="bg-gray-300"
          icon={<Ionicons name="receipt" size={20} color="black" />}
        />

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
