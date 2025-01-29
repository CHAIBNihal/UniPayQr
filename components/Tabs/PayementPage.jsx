import { View, Text, ScrollView, TextInput, Alert, Platform, Image, Button, TouchableOpacity } from 'react-native';
import React, { act, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useGlobalProvider } from '../../Context/GlobalProvider';
import { supabase } from '../../lib/supabase';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PayementPage = () => {
  const { sessionContext, setLoading, setActive, active } = useGlobalProvider();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [id, setId] = useState(null)
  const [isPay, setIsPay] = useState(false)
  const EndPoint = Platform.OS === 'android' ? 'http://192.168.11.114:4242' : 'http://localhost:4242';

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
        setUser(data.username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   const qrCodeData = {
  //     name: user || 'N/A',
  //     email: sessionContext?.user?.email || 'N/A',
  //     phone: phone || 'N/A',
  //     university: university || 'N/A',
  //     amount: '22.00 EUR',
  //     apiEndpoint: `${EndPoint}/create-payment-intent`, // L'URL de l'API
  //     items: [
  //       { id: 1, description: "Paiement pour l'inscription", price: 2200 } // Prix en centimes
  //     ],
  //   };
  //   setQrData(JSON.stringify(qrCodeData)); // Convertit les données en chaîne JSON

  // }, [user, email, phone, university]);

  const handlePayment = async () => {
    try {
      const response = await fetch(`${EndPoint}/create-payment-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sessionContext?.user?.email,
          amount: "22",
          successUrl: `${EndPoint}/success`,
          cancelUrl: `${EndPoint}/cancel`
        }),
      });

      const { url, sessionId } = await response.json();
      // Set idSession il localStorage
      try {
        await AsyncStorage.setItem("idSession",sessionId)
      } catch (error) {
        console.log("Error", error  )
      }
      //Get Url session to pay 
      if (url) {
        setPaymentUrl(url);
      } else {
        setPaymentUrl("https://buy.stripe.com/test_4gw4jrbVicbzc3S144");
      }
    } catch (error) {
      Alert.alert('Error creating payment session', error.message);
    }
  };

 
  useEffect(() => {
    try {
      AsyncStorage.getItem('idSession').then(value=>
      {
         if(value != null ){
          setId(value)

      }else{
        setId("")
      }
        }
      )
      console.log("id session stored", id)
    } catch (error) {
      
    }
    const getSessionData = async () => {
      const res = await fetch(`${EndPoint}/check-payment?session_id=${id}`)
      const data = await res.json()
      // console.log("data session", data)

      if (data.success) {
        setIsPay(true)
        setActive(true)
        console.log("You session is active :", active)
    
      }
      if (!isPay) {
       setActive(false)
    
      }

    }
    getSessionData()
  }, [id]);

  const print = ()=>{
    router.push('/challan')
  }
 
  return !isPay ? (
    <ScrollView className="flex-1 bg-white mb-2" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-center text-gray-800 mb-6">Fill in the fields</Text>

        {/* Full Name */}
        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-4">
          <AntDesign name="user" size={22} color="black" className="mr-3" />
          <TextInput
            className="text-gray-700 flex-1 py-4 px-2 rounded-3xl"
            onChangeText={(text) => setUser(text)}
            value={user || ''}
            placeholder="Full name"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
          />
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-4">
          <Fontisto name="email" size={22} color="black" className="mr-2" />
          <TextInput
            className="text-gray-700 flex-1 py-4 px-2 rounded-3xl"
            placeholder="Email"
            value={sessionContext?.user?.email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-4">
          <AntDesign name="phone" size={22} color="black" className="mr-2" />
          <TextInput
            className="text-gray-700 flex-1 py-4 px-2 rounded-3xl"
            placeholder="00-00-00-00-00"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
          />
        </View>

        {/* University */}
        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-4">
          <FontAwesome name="university" size={22} color="black" className="mr-2" />
          <TextInput
            className="text-gray-700 flex-1 py-4 px-2 rounded-3xl"
            placeholder="University Level"
            value={university}
            onChangeText={(text) => setUniversity(text)}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
          />
        </View>

        <Text className="text-center text-xl font-bold mt-3 text-second">Scan the code to pay</Text>
        <View className="flex-row mt-4 justify-between items-center py-6 px-2">
          {/* Price */}
          <View className="flex-row items-center p-2">
            <Text className="text-xl font-bold text-second">Amount: </Text>
            <Text className="text-lg font-semibold mr-2">22.00</Text>
            <FontAwesome5 name="euro-sign" size={18} color="black" />
          </View>

          {/* QR Code */}
          <View >
            {paymentUrl ? (
              // Utilisation de la bibliothèque QRCode pour afficher un QR Code dynamique
              <QRCode value={paymentUrl} size={128} />
            ) : (
              <TouchableOpacity className="bg-second p-4 rounded-2xl shadow-lg" onPress={handlePayment}>
                <Text className="text-xl text-white font-bold ">Get Qr To pay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  ) : (
    <View className="justify-center items-center flex-1 bg-gray-200">
      <Text className="text-lg font-semibold  ">Payment is successfully made, </Text>
      <TouchableOpacity className="bg-second py-3 px-2 rounded-xl mt-3 " onPress={print}>
        <Text className="text-xl font-bold text-white">print your receipt</Text>
      </TouchableOpacity>
    </View>
  )
};

export default PayementPage;
