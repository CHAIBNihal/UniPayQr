import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from "react-native-heroicons/solid"
import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
const LoginForm = () => {
    const navigation = useNavigation()
    return (
        <View className="bg-second  flex-1 ">
            <SafeAreaView className="flex">
                <View className="flex-row justify-start mb-4 p-2 ">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon color="black" size={20} />
                    </TouchableOpacity>
                    <View className="flex-row justify-center">
                        <Image source={require('../../assets/images/send.png')}
                            style={{ height: 180, width: 360 }}
                        />
                    </View>
                </View>

            </SafeAreaView>
            <View className='bg-white px-8 pt-10 mt-5  flex-1 ' style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <Text className="text-lg text-gray-700 font-bold text-center ">Enter your email address to receive your new password</Text>
                <View className="form mt-4 space-y-2 p-2">
                    <Text className="text-gray-700 text-lg font-semibold ml-4 mb-2">Email Address</Text>
                    <TextInput className="text-gray-700 bg-gray-100 rounded-2xl p-4 mb-2"
                        value="example@gmail.com"
                        placeholder='Enter Email '
                    />



                    <TouchableOpacity className="p-4 w-3/2 bg-second rounded-2xl mt-3">
                        <Text className="text-xl text-center font-semibold text-gray-700">Send me Password</Text>
                    </TouchableOpacity>
                    <View className="flex-row mb-2 ml-4">
                        <Text className="text-lg text-gray-700">You Don't have an account?</Text>
                        <TouchableOpacity className="ml-2" onPress={() => router.push('/sign-up')}>
                            <Text className="text-lg font-semibold underline text-gray-700">Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default LoginForm