import React from 'react';
import {View, Button, Platform, Alert} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useGlobalProvider} from "../../Context/GlobalProvider"

function PaymentScreen() {
const {sessionContext, qrData,
        setQrData} = useGlobalProvider()

const fetchPaymentIntentClientSecret = async () => {
    try {
      const apiEndpoint =
        Platform.OS === 'android' ? 'http://192.168.11.114:4242' : 'http://localhost:4242';
      console.log('API Endpoint:', `${apiEndpoint}/create-payment-intent`);
  
      const response = await fetch(`${apiEndpoint}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ "id": 'item1', "price": 2200 }] }), // Simule des données si nécessaire
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Client Secret:', data.clientSecret);
      return data.clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error.message);
      Alert.alert('Erreur', "Impossible d'obtenir le client secret. Vérifiez votre connexion ou le backend.");
      return null;
    }
  };
  
  

  const {confirmPayment, loading} = useConfirmPayment();

  const handlePayPress = async () => {
    // Gather the customer's billing information (for example, email)
    const billingDetails = {
      email: sessionContext?.user?.email,
    };
  

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();
    if(clientSecret) {
    console.log("Client secret ", clientSecret)
}else{
    console.log("No client secret ")
}
    // Confirm the payment with the card details
    const {paymentIntent, error} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      console.log('Payment confirmation error', error);
    } else if (paymentIntent) {
        Alert.alert("Succes checkOut")
      console.log('Success from promise', paymentIntent);
    }
  };

  return (
    <SafeAreaView className="justify-center   p-2 w-full ">
      <CardField 
      className="mx-3"
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: 'white',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <View className=" p-3 ">
         <Button onPress={handlePayPress} title="CheckOut" disabled={loading} />
      </View>
     
    </SafeAreaView>
  );
}

export default PaymentScreen;