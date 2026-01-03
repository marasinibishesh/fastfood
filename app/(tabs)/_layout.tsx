import { View, Text, Image, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import useAuthStore from '@/store/auth.store'
import { TabBarIconProps } from '@/type'
import { images } from '@/constants'

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 4,
  }}>
    <Image 
      source={icon} 
      style={{ width: 24, height: 24 }} 
      resizeMode="contain" 
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text 
      style={{
        fontSize: 10,
        color: focused ? '#FE8C00' : '#5D5F6D',
        fontWeight: focused ? '600' : '400'
      }}
    >
      {title}
    </Text>
  </View>
)

export default function Tablayout() {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Redirect href="/sign-in" />
    
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" icon={images.home} focused={focused} />
            
          )
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Search" icon={images.search} focused={focused} />
            
          )
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          title: 'Cart',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
            
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Profile" icon={images.user} focused={focused} />
            
          )
        }}
      />
      
    </Tabs>
  );
}
// import { View, Text, Image } from 'react-native'
// import React from 'react'
// import { Redirect, Slot, Tabs } from 'expo-router'
// import useAuthStore from '@/store/auth.store'
// import { TabBarIconProps } from '@/type'
// import { images } from '@/constants'



// const TabBarIcon=({focused,icon,title}:TabBarIconProps)=>(
//   <View className='tab-icon'>
//     <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused?"#FE8C00":"#5D5F6D"}/>
//     <Text>
//       {title}
//     </Text>

//   </View>
// )

// export default function Tablayout() {
//     const {isAuthenticated}=useAuthStore();
//     if(!isAuthenticated) return <Redirect href="/sign-in"/>
//   return (
//     <Tabs screenOptions={{
      //   tabBarShowLabel: false,
      //   tabBarStyle: {
      //     backgroundColor: '#fff',
      //     borderTopWidth: 1,
      //     borderTopColor: '#E5E7EB',
      //     height: 60,
      //     paddingBottom: 8,
      //     paddingTop: 8,
      //   }
      // }}>
//       <Tabs.Screen
//       name='index'
//       options={{
//         title:'',
//         tabBarIcon:({focused})=><TabBarIcon title="Home" icon={images.home}focused={focused}/>
//       }}
//       />
//     </Tabs>
//   );
// }