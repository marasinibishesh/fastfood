import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { account, databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';
import { images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '@/store/auth.store';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuthStore();
  
  const [user, setUser] = useState({
    $id: '',
    accountId: '',
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const currentAccount = await account.get();
      
      const userData = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );

      if (userData.documents.length > 0) {
        const userDoc = userData.documents[0];
        setUser({
          $id: userDoc.$id,
          accountId: userDoc.accountId,
          name: userDoc.name || '',
          email: userDoc.email || '',
          avatar: userDoc.avatar || ''
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await account.deleteSession('current');
              logout();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">                                          
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE8C00" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Simple Header */}
        <View className="bg-gray-50 px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Image 
                source={images.arrowBack} 
                style={{ width: 20, height: 20 }} 
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <Text style={{ fontFamily: 'Quicksand-Bold' }} className="text-xl text-gray-800">
              My Profile
            </Text>
            
            <View style={{ width: 44 }} />
          </View>

          {/* Profile Card */}
          <View 
            className="bg-white rounded-3xl p-6 items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* Avatar with Gradient Ring */}
            <View className="relative mb-5">
              <View className="w-28 h-28 rounded-full items-center justify-center">
                <View className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                <View className="w-24 h-24 rounded-full bg-white items-center justify-center">
                  <Image
                    source={{ uri: user.avatar }}
                    style={{ width: 88, height: 88, borderRadius: 44 }}
                  />
                </View>
              </View>
              
              {/* Active Status Indicator */}
              <View className="absolute bottom-0 right-0 w-7 h-7 bg-success rounded-full border-4 border-white items-center justify-center">
                <View className="w-3 h-3 bg-white rounded-full" />
              </View>
            </View>

            {/* User Info */}
            <Text style={{ fontFamily: 'Quicksand-Bold' }} className="text-2xl text-gray-800 text-center mb-1">
              {user.name}
            </Text>
            <View className="bg-white-100 px-4 py-2 rounded-full">
              <Text style={{ fontFamily: 'Quicksand-Medium' }} className="text-sm text-gray-500">
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Details Section */}
        <View className="px-6 mt-6">
          <Text style={{ fontFamily: 'Quicksand-Bold' }} className="text-base text-gray-800 mb-4">
            Account Details
          </Text>
          
          <InfoCard 
            icon={images.person} 
            label="Full Name" 
            value={user.name}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
          />
          
          <InfoCard 
            icon={images.envelope} 
            label="Email Address" 
            value={user.email}
            iconBg="#F5F3FF"
            iconColor="#A855F7"
          />
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white rounded-2xl py-5 flex-row items-center justify-center border border-red-200"
            style={{
              shadowColor: '#EF4444',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <View className="w-11 h-11 bg-red-50 rounded-full items-center justify-center mr-3">
              <Image 
                source={images.logout} 
                style={{ width: 20, height: 20 }} 
                resizeMode="contain"
                tintColor="#EF4444"
              />
            </View>
            <Text style={{ fontFamily: 'Quicksand-Bold' }} className="text-red-500 text-base">
              Logout from Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View className="items-center mt-10">
          <Text style={{ fontFamily: 'Quicksand-Medium' }} className="text-gray-400 text-xs">
            App Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Info Card Component
const InfoCard = ({ 
  icon, 
  label, 
  value,
  iconBg,
  iconColor 
}: { 
  icon: any; 
  label: string; 
  value: string;
  iconBg: string;
  iconColor: string;
}) => (
  <View 
    className="bg-white rounded-2xl p-4 mb-3"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    }}
  >
    <View className="flex-row items-center">
      <View 
        className="w-14 h-14 rounded-2xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Image 
          source={icon} 
          style={{ width: 24, height: 24 }} 
          resizeMode="contain"
          tintColor={iconColor}
        />
      </View>
      <View className="ml-4 flex-1">
        <Text style={{ fontFamily: 'Quicksand-Medium' }} className="text-xs text-gray-400 mb-1">
          {label}
        </Text>
        <Text 
          style={{ fontFamily: 'Quicksand-SemiBold' }} 
          className="text-base text-gray-800"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  </View>
);

export default Profile;
// import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { router } from 'expo-router';
// import { account, databases, appwriteConfig } from '@/lib/appwrite';
// import { Query } from 'react-native-appwrite';
// import { images } from '@/constants';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import useAuthStore from '@/store/auth.store';

// const Profile = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const { logout } = useAuthStore();
  
//   const [user, setUser] = useState({
//     $id: '',
//     accountId: '',
//     name: '',
//     email: '',
//     avatar: ''
//   });

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       const currentAccount = await account.get();
      
//       const userData = await databases.listDocuments(
//         appwriteConfig.databaseId,
//         appwriteConfig.userCollectionId,
//         [Query.equal('accountId', currentAccount.$id)]
//       );

//       if (userData.documents.length > 0) {
//         const userDoc = userData.documents[0];
//         setUser({
//           $id: userDoc.$id,
//           accountId: userDoc.accountId,
//           name: userDoc.name || '',
//           email: userDoc.email || '',
//           avatar: userDoc.avatar || ''
//         });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load user data');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await account.deleteSession('current');
//               logout();
//               router.replace('/(auth)/sign-in');
//             } catch (error) {
//               Alert.alert('Error', 'Failed to logout');
//               console.error(error);
//             }
//           }
//         }
//       ]
//     );
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50">                                          
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#FE8C00" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView 
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 140 }}
//       >
//         {/* Header */}
//         <View className="bg-white px-5 py-4 flex-row items-center justify-between">
//           <TouchableOpacity onPress={() => router.back()}>
//             <Image 
//               source={images.arrowBack} 
//               style={{ width: 24, height: 24 }} 
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//           <Text style={{ fontFamily: 'Quicksand-Bold' }} className="text-xl text-gray-800">
//             Profile
//           </Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Profile Picture */}
//         <View className="items-center mt-8 mb-6">
//           <Image
//             source={{ uri: user.avatar }}
//             style={{ width: 120, height: 120, borderRadius: 60 }}
//           />
//         </View>

//         {/* Profile Information */}
//         <View className="px-5">
//           <InfoCard 
//             icon={images.person} 
//             label="Full Name" 
//             value={user.name} 
//           />
//           <InfoCard 
//             icon={images.envelope} 
//             label="Email" 
//             value={user.email} 
//           />

//           {/* Logout Button */}
//           <TouchableOpacity
//             onPress={handleLogout}
//             className="bg-red-50 border border-red-300 rounded-full py-4 mt-5 flex-row items-center justify-center"
//           >
//             <Image 
//               source={images.logout} 
//               style={{ width: 20, height: 20, marginRight: 8 }} 
//               resizeMode="contain"
//               tintColor="#EF4444"
//             />
//             <Text style={{ fontFamily: 'Quicksand-SemiBold' }} className="text-red-500">
//               Logout
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const InfoCard = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
//   <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
//     <View className="flex-row items-center">
//       <Image 
//         source={icon} 
//         style={{ width: 20, height: 20 }} 
//         resizeMode="contain"
//         tintColor="#FE8C00"
//       />
//       <View className="ml-3 flex-1">
//         <Text style={{ fontFamily: 'Quicksand-Medium' }} className="text-xs text-gray-500 mb-1">
//           {label}
//         </Text>
//         <Text style={{ fontFamily: 'Quicksand-SemiBold' }} className="text-base text-gray-800">
//           {value}
//         </Text>
//       </View>
//     </View>
//   </View>
// );

// export default Profile;