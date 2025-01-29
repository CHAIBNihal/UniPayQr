import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from "react-native-heroicons/solid"
import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
import { supabase } from "../../lib/supabase"
const RegisterForm = () => {

    const navigation = useNavigation()
    const [Form, setForm] = useState({
   
        email: "",
        password: ""
    })
    
    const email = Form.email.trim()
    const password = Form.password.trim()
    const [Error, setError] = useState("")
    const [loading, setloading] = useState(false)


    const isValidEmail = (email) => {
        const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegx.test(email)
    }
    const isValid = () => {
        if ( email === "" || password === "") {
            setError("One or all fields are invalid");
            return false;
        }
       
        if (!isValidEmail(email)) {
            setError("Email is invalid!");
            return false;
        }
        if (password.length < 6) {
            setError("The password must be at least 6 characters long");
            return false;
        }
        return true; // Aucun problème détecté
    };

    const onSubmit = async () => {
        setloading(true);
        setError("");
    
        if (!isValid()) {
            setloading(false);
            return;
        }
    
       
            const { data : {session}, error } = await supabase.auth.signUp({
                
                email:email,
                password :password,
                
              
            });
    
            if (error) {
                setError(error.message);
            } if(!session) {
                setError("Please check your inbox for verification");
                setloading(false)
               
            }
    
         
      
           
    };
    


    return (
        <ScrollView>
            <View className="bg-second  flex-1 ">
                <SafeAreaView className="flex">
                    <View className="flex-row justify-start mb-4 p-2 ">
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeftIcon color="black" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row justify-center">
                        <Image source={require('../../assets/images/online-wom.png')}
                            style={{ height: 180, width: 400 }}
                        />
                    </View>
                </SafeAreaView>
                <View className='bg-white px-8 pt-8 mt-5 h-screen  flex-1 ' style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                    <Text className="text-4xl text-gray-700 font-bold text-center ">Get Your Challan!</Text>
                    {
                        Error ? (
                            <Text className="text-center text-red-700 font-semibold text-lg mt-3">
                                {Error}
                            </Text>
                        ) : null
                    }
                    <View className="form mt-4 space-y-2 p-2">
                        <Text className="text-gray-700 text-lg font-semibold ml-4 mb-2">Email Address</Text>
                        <TextInput className="text-gray-700 bg-gray-100 rounded-2xl p-4 mb-2"
                            value={Form.email}
                            placeholder='Enter Email '
                            onChangeText={(e) => setForm({ ...Form, email: e })}
                            autoCapitalize='none'
                        />

                        <Text className="text-gray-700 text-lg font-semibold ml-4 mb-2">Password</Text>
                        <TextInput className="text-gray-700 bg-gray-100 rounded-2xl p-4 mb-2"
                            value={Form.password}
                            placeholder='Enter Email '
                            onChangeText={(e) => setForm({ ...Form, password: e })}
                            autoCapitalize='none'
                            secureTextEntry
                        />


                        <View className="flex-row mb-2 ml-4">
                            <Text className="text-lg text-gray-700">Already have an account?</Text>
                            <TouchableOpacity className="ml-2" onPress={() => router.push('/login')}>
                                <Text className="text-lg font-semibold underline text-gray-700">Login</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={onSubmit}
                            className="p-4 w-3/2 bg-second rounded-2xl mt-3">
                            <Text className="text-xl text-center font-semibold text-gray-700">Sign-Up</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default RegisterForm