import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import Custominput from '@/components/Custominput'
import { signIn } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import * as Sentry from '@sentry/react-native'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({email: '', password: ''});
  const { fetchAuthenticatedUser } = useAuthStore();
  
  const submit = async () => {
    const {email, password} = form;
    if(!email || !password) return Alert.alert('Error', 'Please enter valid email & password')
    
    setIsSubmitting(true)
    try {
      // Call Appwrite Sign In function
      await signIn({email, password});
      
      // Update auth store with the logged-in user
      await fetchAuthenticatedUser();
      
      Alert.alert('Success', 'User signed in Successfully');
      router.replace('/(tabs)');
    } catch(error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <View className='gap-10 bg-white rounded-lg p-5 pb-8'>
      <Custominput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
        label="Email"
        keyboardType="email-address"
      />
      <Custominput
        placeholder='Enter your Password'
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton 
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>
          Don't have an account?
        </Text>
        <Link href="/sign-up" className='base-bold text-primary'>Sign up</Link>
      </View>
    </View>
  )
}

export default SignIn







// import { View, Text, Button, Alert } from 'react-native'
// import React, { useState } from 'react'
// import { Link, router } from 'expo-router'
// import CustomButton from '@/components/CustomButton'
// import Custominput from '@/components/Custominput'
// import { signIn } from '@/lib/appwrite'
// import * as Sentry from '@sentry/react-native'
// const SignIn = () => {
//   const[isSubmitting,setIsSubmitting]=useState(false);
//   const[form,setForm]=useState({email:'',password:''});
  
//   const submit=async()=>{
//     const {email,password}=form;
//    if(!email|| !password) return Alert.alert('Error','Please enter valid email & password')
//     setIsSubmitting(true)
//   try{
//     //Call Appwrite Sign In function
//     await signIn({email,password});
//     Alert.alert('Success','User signed in Successfully');
//     router.replace('/');
//   } catch(error: any){
//     Alert.alert('Error',error.message);
//     Sentry.captureEvent(error);
//   } finally{
//     setIsSubmitting(false);
//   }
//   }
  
//   return (
//     <View className='gap-10 bg-white rounded-lg p-5 pb-8'>
//         <Custominput
//           placeholder='Enter your email'
//           value={form.email}
//           onChangeText={(text)=>setForm((prev)=>({...prev,email:text}))}
//           label="Email"
//           keyboardType="email-address"
//           />
//           <Custominput
//           placeholder='Enter your Password'
//           value={form.password}
//           onChangeText={(text)=>setForm((prev)=>({...prev,password:text}))}
//           label="Password"
//           secureTextEntry={true}
//           />
//           <CustomButton title="Sign In"
//           isLoading={isSubmitting}
//           onPress={submit}/>
//           <View className='flex justify-center mt-5 flex-row gap-2'>
//                       <Text className='base-regular text-gray-100'>
//                         Already have an account ?
//                       </Text>
//                       <Link href="/sign-up" className='base-bold text-primary'>Sign up</Link>
//                     </View>
//     </View>
//   )
// }

// export default SignIn

// import { View, Text, Button, Alert } from 'react-native'
// import React, { useState } from 'react'
// import { Link, router } from 'expo-router'
// import CustomButton from '@/components/CustomButton'
// import Custominput from '@/components/Custominput'

// const SignIn = () => {
//   const[isSubmitting,setIsSubmitting]=useState(false);
//   const[form,setForm]=useState({email:'',password:''}
//   );
//   const submit=async()=>{
//    if(!form.email|| !form.password) return Alert.alert('Error','Please enter vaid email & password')
//     setIsSubmitting(true)
//   try{
//     //Call Appwrite Sign In function
//     Alert.alert('Success','User signed in Successfully');
//     router.replace('/');
//   } catch(error: any){
//     Alert.alert('Error',error.message);
//   } finally{
//     setIsSubmitting(false);
//   }
//   }
//   return (
//     <View className='gap-10 bg-white rounded-lg p-5 mt-5'>








//         <Custominput
//           placeholder='Enter your email'
//           value={form.email}
//           onChangeText={(text)=>setForm((prev)=>({...prev,email:text}))}
//           label="Email"
//           keyboardType="email-address"
//           />
//           <Custominput
//           placeholder='Enter your Password'
//           value={form.password}
//           onChangeText={(text)=>setForm((prev)=>({...prev,password:text}))}
//           label="Password"
//           secureTextEntry={true}
//           />
//           <CustomButton title="Sign In"
//           isLoading={isSubmitting}
//           onPress={submit}/>
//           <View className='flex justify-center mt-5 flex-row gap-2'>
//             <Text className='base-regular text-gray-100'>
//               Don't have an account ?
//             </Text>
//             <Link href="/sign-up" className='base-bold text-primary'>Sign Up</Link>
//           </View>
//     </View>
//   )
// }

// export default SignIn