import { View, Text, ScrollView, TextInput, Alert, Platform, RefreshControl , TouchableOpacity, Image } from 'react-native';
import React, {  useEffect, useState,useRef } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useGlobalProvider } from '../../Context/GlobalProvider';
import { supabase } from '../../lib/supabase';
import QRCode from 'react-native-qrcode-svg';


import AsyncStorage from '@react-native-async-storage/async-storage';
const PayementPage = () => {
  const { sessionContext, setLoading, setActive, active, isHaveChallan, setisHaveChallan } = useGlobalProvider();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [id, setId] = useState(null)
  const [isPay, setIsPay] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [isCreated, setIsCreated] = useState(false)

  console.log("is Pay 1", isPay)

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
        .select('username ,website, avatar_url, phone, level')
        .eq('id', sessionContext?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUser(data.username);
        setLevel(data.level)
        setPhone(data.phone)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }



  const handlePayment = async () => {

    try {
      
    } catch (error) {
      
    }
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


 const getSessionData = async () => {
      const res = await fetch(`${EndPoint}/check-payment?session_id=${id}`)
      const data = await res.json()
      if(data.session.customer_details.email == sessionContext?.user?.email ) {

         if (data.success) {

         setIsPay(true)
         console.log("isPay2", isPay)
        
         setActive(true)
         }
         else{
        setisHaveChallan(false)
        setIsPay(isPay)
        setActive(active)
      }

      }else{
          const emailPay = await fetch(`${EndPoint}/check-email-payment?email=${sessionContext?.user?.email}`)
          const resEmail = await emailPay.json()
          // console.log("resEmail", resEmail)
          console.log("Id email data", data.session.id)
          if(resEmail.success){
          
            setIsPay(() => data.success);
           console.log("isPay3 in case email is similar but no successpayment", isPay)
      
            setActive(true)
            console.log("Is payment email case ", active)
          }else{
            setIsPay(false)
            setActive(false)
          }
   
          console.log("Error at fetching data with this email ", error )
      
        
        console.log('Email non compatible')
        setIsPay(false)
        setActive(false)
      }
      
  
    }
 
  useEffect(() => {
    try {
      AsyncStorage.getItem('idSession').then(value=> {if(value != null ){setId(value)}else{setId("")}})
    } catch (error) {
    console.log("Error at stored data at localstorage", error)  
    }
  
    getSessionData()
   
  }, [isPay]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getSessionData()
    setRefreshing(false);
  };


  const createChallan = async () => {
    try {
      const { data, error } = await supabase
        .from('challan')
        .insert([{ userid: sessionContext?.user?.id, dateCreation: new Date(), amount : 22, email:sessionContext?.user?.email, name:user, Level:level, phone:phone }]);
      if (error) {
        console.error("Erreur lors de la création du challan :", error.message);
        Alert.alert('Erreur', 'Échec de la création du challan.');
        setisHaveChallan(false)
        console.log("have it a challan ??", isHaveChallan)
      } else {
        Alert.alert('Succès', 'Challan créé avec succès.');
        setisHaveChallan(true)
       
      }

   
    } catch (error) {
      console.error("Erreur inattendue :", error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
    }
  };
  

  const saveUserData = async ({level, phone})=>{
    console.log("updated")
    try {
     const updates = {
            id: sessionContext?.user.id,
            level,
            phone,
            updated_at: new Date(),
           };
           const { error: profileError } = await supabase.from('profiles').upsert(updates);
           
           if (profileError) {
            Alert.alert(profileError)
          };
          Alert.alert('data success updated')

           
    } catch (error) {
      console.log("Error while updating data ", error)
    }
  }




  return !isPay ? (
    <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
     className="flex-1 bg-white mb-2" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
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
            value={level}
            onChangeText={(text) => setLevel(text)}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
          />
        </View>
        <Text className="text-sm font-bold text-red-400 ">save your data before paying</Text>
        <TouchableOpacity className="bg-gray-400 py-3 px-2 rounded-xl mt-3 " onPress={()=>saveUserData({phone, level})}>
        <Text className="text-xl font-bold text-center">save your personnel data</Text>
      </TouchableOpacity>

       
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
      <Text className="text-lg font-semibold  ">Payment is successfully made! </Text>
      {isHaveChallan ? (
        <View className="fklex-1 justify-center items-center mt-3">
          <Text className="font-semibold text-lg mt-4">your challan is already created visit the challan page </Text>
          <Image source={require('../../assets/images/bill.png')}
          style={{height :  180, width: 180}}
          className="mt-3 "
          />
        </View>
      ) : (
        <TouchableOpacity className="bg-second py-3 px-2 rounded-xl mt-3 " onPress={createChallan}>
        <Text className="text-xl font-bold text-white">Get Challan</Text>
      </TouchableOpacity>) }
    </View>
  )
};

export default PayementPage;
