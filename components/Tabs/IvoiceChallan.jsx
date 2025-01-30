/* This file has been downloaded from rnexamples.com */
/* If You want to help us please go here https://www.rnexamples.com/help-us */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useGlobalProvider } from "../../Context/GlobalProvider"
const InvoiceScreen = () => {
  const { sessionContext, setisHaveChallan, isHaveChallan } = useGlobalProvider()
  const [name, setname] = useState("")
  const [email, setEmail] = useState("")
  const [date, setdate] = useState("")
  const [phone, setphone] = useState("")
  const [level, setlevel] = useState("")
  const [idChallan, setidChallan] = useState("")
  const [refreshing, setRefreshing] = useState(false);

  const getChallanByIdUser = async () => {
    try {
      console.log("id user", sessionContext?.user?.id)
      const { data, error } = await supabase.from('challan').select('idchallan, dateCreation, Level, phone, email, name').eq('userid', sessionContext?.user?.id).single();
      if (error) {
        setisHaveChallan(false)
        console.log("Error while searching this challan", error)
      } else {
        console.log(data)
        setname(data.name)
        setEmail(data.email)
        setdate(data.dateCreation)
        setphone(data.phone)
        setlevel(data.Level)
        setidChallan(data.idchallan)
        setisHaveChallan(true)
      }


      console.log(object)
    } catch (error) {

    }
  }

  useEffect(() => {
    getChallanByIdUser()
  })
const handleRefresh = async () => {
    setRefreshing(true);
    await getSessionData()
    setRefreshing(false);
  };



  return isHaveChallan ? (<ScrollView  className="bg-gray-200 py-6 " refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} contentContainerStyle={styles.container}>
    <Text className="text-second mt-7 " style={styles.title}> Receipt</Text>
    <Text style={styles.date}> {date} / No.{idChallan}</Text>
    <View style={styles.info}>
      <Text style={styles.infoText}> {name}</Text>
      <Text style={styles.infoText}>{email} </Text>
      <Text style={styles.infoText}>{level}</Text>
      <Text style={styles.infoText}>{phone} </Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>Registration</Text>
      <Text style={styles.itemText}>$10.00</Text>
    </View>

    <View style={styles.itemRow}>
      <Text style={styles.itemText}>Direction</Text>
      <Text style={styles.itemText}>$6.00</Text>
    </View>
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>Library Fees</Text>
      <Text style={styles.itemText}>$6.00</Text>
    </View>

    <View style={styles.divider} />
    <View style={styles.totalRow}>
      <Text style={styles.totalText}>Total</Text>
      <Text style={styles.totalText}>$22.00</Text>
    </View>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Print Receipt</Text>
    </TouchableOpacity>
  </ScrollView>) : (
    <View className="justify-center flex-1 items-center bg-gray-200 ">
      <Text className="text-center font-semibold text-xl">Create challan and get Receipt </Text>
    </View>
  )

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 16,

  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  info: {

    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemText: {
    fontSize: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius : 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default InvoiceScreen;
