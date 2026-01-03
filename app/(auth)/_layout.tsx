import { View, Dimensions, ImageBackground, Image, StatusBar, Platform } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { images } from '@/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function _layout() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
  
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <View
          className="w-full -mt-0"
          style={{ 
            height: Dimensions.get('screen').height / 2.25 + statusBarHeight,
          }}
        >
          <ImageBackground
            source={images.thakali}
            resizeMode="cover"
            style={{ flex: 1 }}
            imageStyle={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          />
          <Image 
            source={images.logo} 
            className='self-center size-24 absolute -bottom-12 z-10 rounded-2xl'
          />
        </View>
        <Slot/>      
      </KeyboardAwareScrollView>
    </View>
  )
}