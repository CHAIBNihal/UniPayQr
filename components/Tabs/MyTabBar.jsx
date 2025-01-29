import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const MyTabBar = ({ state, descriptors, navigation }) => {
    const primaryColor = "black"
    const seconsColor = "#737373"
    
    const icons = {
        home : (props)=><AntDesign name="home" size={24} color={primaryColor} {...props}/>,
        payement : (props)=><MaterialCommunityIcons size={24} name="qrcode" color={primaryColor} {...props} />,
        challan : (props)=><FontAwesome name="wpforms" size={24} color={primaryColor} {...props} />,
        profile : (props)=><MaterialIcons name="manage-accounts" size={24} color={primaryColor} {...props} />
    }
  return (
    <View className="flex-row  absolute bottom-6 justify-center items-center bg-gray-100  mx-5 py-3 rounded-3xl shadow-blue-500/50 shadow-md ">
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;
   
      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <TouchableOpacity
        className="flex-1 justify-center items-center "
        key={route.name}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={{ flex: 1 }}
        >
            {
                icons[route.name]({
                    color:isFocused?primaryColor:seconsColor
                })
            }
          <Text className="text-md gap-1" style={{ color: isFocused ? primaryColor : seconsColor }}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
  )
}

export default MyTabBar