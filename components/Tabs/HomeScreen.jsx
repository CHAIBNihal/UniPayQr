import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useGlobalProvider } from "../../Context/GlobalProvider";
const HomeScreen = () => {

  const { sessionContext, active, name, isHaveChallan } = useGlobalProvider();
  const [date, setdate] = useState("")
  const [email, setemail] = useState("")
  const [idChallan, setidChallan] = useState("")


  const getChallanDetails = async () => {
    try {
      const { data, error } = await supabase.from('challan').select('idchallan, dateCreation').eq('userid', sessionContext?.user?.id).single();
      if (error) {
        console.log("Error while getting data challan", error)
      } else {
        console.log("data", data)
        setdate(data.dateCreation)
        setidChallan(data.idchallan)
      }
    } catch (error) {

    }
  }



  useEffect(() => {
    console.log("Loading...")
    getChallanDetails()
  })
  return (
    <View className="bg-gray-200" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🎓 UniPayQr</Text>
      </View>

      {/* Section de bienvenue */}
      <Text style={styles.welcomeText}>Welcome {name} 👋</Text>
      <Text style={styles.subtitle}>Manage your payments easily</Text>

      {/* Boutons d'action rapide */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity className="bg-second" style={styles.actionButton} onPress={() => router.push('/payement')}>
          <Ionicons name="card-outline" size={28} color="white" />
          <Text style={styles.actionText}>Get a Challan</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-second" style={styles.actionButton} onPress={() => router.push('/profile')}>
          <Ionicons name="help-circle-outline" size={28} color="white" />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des derniers challans */}
      <Text style={styles.sectionTitle}>Challan</Text>

      {/**If have it a challan */}
      {
        isHaveChallan ? (
          <View style={styles.challanCard}>
            <View>
              <Text style={styles.challanTitle}>Invoice No {idChallan} </Text>
              <Text style={styles.challanDetails}> {name} </Text>
              <Text style={styles.challanDetails}>{sessionContext?.user?.email}</Text>
              <Text style={styles.challanDetails}>{date} </Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={() => router.push('/challan')}>
              <Ionicons name="receipt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.challanCard}>
            <View>
              <Text className="text-center font-semibold text-xl ">Create Challan </Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={() => router.push('/payement')}>
              <Ionicons name="receipt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 18 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  actionsContainer: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 20 },
  actionButton: { padding: 15, borderRadius: 10, alignItems: "center", width: "30%" },
  actionText: { color: "white", fontSize: 14, marginTop: 5, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  challanCard: { backgroundColor: "white", padding: 15, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  challanTitle: { fontSize: 16, fontWeight: "bold" },
  challanDetails: { fontSize: 14, color: "#666" },
  payButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, backgroundColor: "#F6C794" },
  payText: { color: "white", fontWeight: "bold" },
});
