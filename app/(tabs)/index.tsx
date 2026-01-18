import "../../global.css"
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import cn from "clsx";

import CartButton from "@/components/CartButton";
import { offers, images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories } from "@/lib/appwrite";

// Map offer titles to category names
const getCategoryNameFromOffer = (offerTitle: string): string => {
  const titleLower = offerTitle.toLowerCase();
  
  if (titleLower.includes('momo')) return 'Momo';
  if (titleLower.includes('chowmein')) return 'Chowmein';
  if (titleLower.includes('khana') || titleLower.includes('thali')) return 'Nepali-Khana';
  if (titleLower.includes('burger')) return 'Burgers';
  if (titleLower.includes('pizza')) return 'Pizzas';
  if (titleLower.includes('burrito')) return 'Burritos';
  if (titleLower.includes('soup')) return 'Soup';
  if (titleLower.includes('wrap')) return 'Wraps';
  
  return ''; // Empty string means "All" category
};

export default function Index() {
  const { user } = useAuthStore();
  const { data: categories } = useAppwrite({ fn: getCategories });
  
  const handleOfferPress = (offerTitle: string) => {
    const categoryName = getCategoryNameFromOffer(offerTitle);
    
    // Find the matching category ID from database
    const category = categories?.find(cat => cat.name === categoryName);
    
    // Navigate to search tab with category ID
    if (category) {
      router.push({
        pathname: "/(tabs)/search",
        params: { category: category.$id }
      });
    } else {
      // If no category found, just go to search without filter
      router.push("/(tabs)/search");
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                style={{ backgroundColor: item.color }}
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row"
                )}
                android_ripple={{ color: "#ffffff22" }}
                onPress={() => handleOfferPress(item.title)}
              >
                <View className="h-full w-1/2">
                  <Image
                    source={item.image}
                    className="size-full"
                    resizeMode="contain"
                  />
                </View>

                <View className={cn("offer-card_info flex-1 justify-center px-4", isEven ? 'pl-7' : 'pr-7')}>
                  <Text className="text-white text-2xl font-quicksand-bold leading-tight flex-wrap" numberOfLines={0}>
                    {item.title}
                  </Text>
                  <Image
                    source={images.arrowRight}
                    className="size-10"
                    resizeMode="contain"
                    tintColor="#ffffff"
                  />
                </View>
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        contentContainerClassName="px-5"
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5 px-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">Deliver To</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">Kathmandu</Text>
                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// import "../../global.css"
// import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import cn from "clsx";

// import CartButton from "@/components/CartButton";
// import { offers, images } from "@/constants";
// import useAuthStore from "@/store/auth.store";

// export default function Index() {
//   const { user } = useAuthStore();
//   console.log("useAuthStore", user)
  
//   return (
//     <SafeAreaView className="flex-1 bg-white" edges={['top']}>
//       <FlatList
//         data={offers}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item, index }) => {
//           const isEven = index % 2 === 0;

//           return (
//             <View>
//               <Pressable
//                 style={{ backgroundColor: item.color }}
//                 className={cn(
//                   "offer-card",
//                   isEven ? "flex-row-reverse" : "flex-row"
//                 )}
//                 android_ripple={{ color: "#fffff22" }}
//               >
//                 <View className="h-full w-1/2">
//                   <Image
//                     source={item.image}
//                     className="size-full"
//                     resizeMode="contain"
//                   />
//                 </View>

//                 <View className={cn("offer-card_info flex-1 justify-center px-4", isEven ? 'pl-7' : 'pr-7')}>
//                   <Text className="text-white text-2xl font-quicksand-bold leading-tight flex-wrap" numberOfLines={0}>
//                     {item.title}
//                   </Text>
//                   <Image
//                     source={images.arrowRight}
//                     className="size-10"
//                     resizeMode="contain"
//                     tintColor="#ffffff"
//                   />
//                 </View>
//               </Pressable>
//             </View>
//           );
//         }}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         contentContainerClassName="px-5"
//         ListHeaderComponent={() => (
//           <View className="flex-between flex-row w-full my-5 px-5">
//             <View className="flex-start">
//               <Text className="small-bold text-primary">Deliver To</Text>
//               <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
//                 <Text className="paragraph-bold text-dark-100">Kathmandu</Text>
//                 <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
//               </TouchableOpacity>
//             </View>
//             <CartButton />
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }
// import "../../global.css"
// import { FlatList, Image, Pressable, Text, TouchableOpacity, View,Button} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import cn from "clsx";
// import * as Sentry from '@sentry/react-native';




// import CartButton from "@/components/CartButton";
// import { offers,images } from "@/constants";
// import useAuthStore from "@/store/auth.store";

// export default function Index() {
//   const{user}=useAuthStore();
//   console.log("useAuthStore",user)
//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <FlatList
//         data={offers}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item, index }) => {
//           const isEven = index % 2 === 0;

//           return (
//             <View>
//               <Pressable
//                 style={{ backgroundColor: item.color }}
//                 className={cn(
//                   "offer-card",
//                   isEven ? "flex-row-reverse" : "flex-row"
//                 )}
//                 android_ripple={{color:"#fffff22"}}
//               >
//                 <View className="h-full w-1/2">
//                   <Image
//                     source={item.image}
//                     className="size-full"
//                     resizeMode="contain"
//                   />
//                 </View>

//                 <View className={cn("offer-card_info flex-1 justify-center px-4",isEven?'pl-7':'pr-7')}>
//                  <Text className="text-white text-2xl font-quicksand-bold leading-tight flex-wrap"numberOfLines={0}>
//                 {item.title}
//                       </Text>
//                       <Image
//                       source={images.arrowRight}
//                       className="size-10"
//                       resizeMode="contain"
//                       tintColor="#ffffff"
//                       />
//                 </View>
//               </Pressable>
//             </View>
//           );
//         }}
//         contentContainerClassName="pb-28 px-5"
//         ListHeaderComponent={()=>(<View className="flex-between flex-row w-full my-5 px-5">
//         <View className="flex-start">
//           <Text className="small-bold text-primary">Deliver To</Text>
//           <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
//             <Text className="paragraph-bold text-dark-100">Kathmandu</Text>
//           <Image source={images.arrowDown} className="size-3" resizeMode="contain"/>
//           </TouchableOpacity>
          
//         </View>
//         <CartButton/>
//       </View>)}
//       />
//     </SafeAreaView>
//   );
// }
