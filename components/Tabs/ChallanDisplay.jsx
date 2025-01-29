import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useGlobalProvider } from '../../Context/GlobalProvider';

import PaymentScreen from '../Payment/PaymentScreen';


const ChallanDisplay = () => {
  const { sessionContext } = useGlobalProvider();
  
  // Initialiser la clé Stripe au premier rendu
  return (
    <View className="flex-1 justify-center items-center">
      <StripeProvider publishableKey="pk_test_51QlYYh2U5r8dIM2Szf8xDgINveLRSwZTiigjqrshWEgk1TlrakrEbA8ynLOusfwU6Ca377K7efZniZERUDyRk1tp00EdiBS0kT">
      <PaymentScreen />
    </StripeProvider>
    </View>
  );
};

export default ChallanDisplay;
