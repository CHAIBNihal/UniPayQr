import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Cards = ({title, direction, icon, color }) => {
  return (
    <SafeAreaView>
        <View className= {`flex-row rounded-2xl items-center justify-center py-4 px-4 mx-6  ${color}`}>
        <View className="mr-2 p-2 ">
            {icon}
        </View>
      <TouchableOpacity onPress={direction} >
        <Text className="font-semibold text-xl text-center text-gray-800">
            {title}
        </Text>

      </TouchableOpacity>
    </View>
    </SafeAreaView>
    
  )
}

export default Cards