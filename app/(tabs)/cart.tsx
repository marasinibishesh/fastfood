import { View, Text, FlatList, Modal, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCartStore } from '@/store/cart.store'
import CustomHeader from '@/components/CustomHeader'
import cn from "clsx";
import { PaymentInfoStripeProps } from '@/type'
import CustomButton from '@/components/CustomButton'
import CartItem from '@/components/CartItem'

const PaymentInfoStripe = ({ label, value, labelStyle, valueStyle }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const OrderConfirmationModal = ({ visible, onClose, totalAmount }: { 
    visible: boolean; 
    onClose: () => void;
    totalAmount: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-5">
                <Animated.View 
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
                    }}
                    className="bg-white rounded-3xl p-8 w-full max-w-sm items-center"
                >
                    {/* Success Icon */}
                    <View className="w-20 h-20 bg-success/10 rounded-full items-center justify-center mb-6">
                        <Text className="text-5xl">✓</Text>
                    </View>

                    {/* Success Message */}
                    <Text className="h2-bold text-dark-100 text-center mb-2">
                        Order Placed!
                    </Text>
                    <Text className="paragraph-regular text-gray-200 text-center mb-6">
                        Your order has been successfully placed and is being prepared
                    </Text>

                    {/* Order Details */}
                    <View className="w-full bg-gray-50 rounded-2xl p-4 mb-6">
                        <View className="flex-row justify-between mb-2">
                            <Text className="paragraph-medium text-gray-200">
                                Order Total
                            </Text>
                            <Text className="base-bold text-dark-100">
                                Rs {totalAmount.toFixed(2)}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="paragraph-medium text-gray-200">
                                Estimated Delivery
                            </Text>
                            <Text className="base-bold text-success">
                                30-45 mins
                            </Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <CustomButton 
                        title="Continue Shopping"
                        onPress={onClose}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

const cart = () => {
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(0); // Add this state
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const finalTotal = totalPrice + 40 - 10;

    const handleOrderNow = () => {
        setIsProcessing(true);
        // Capture the total BEFORE clearing cart
        setConfirmedOrderTotal(finalTotal);
        
        // Simulate order processing
        setTimeout(() => {
            setIsProcessing(false);
            setShowConfirmation(true);
            // Clear the cart after showing confirmation
            setTimeout(() => {
                clearCart();
            }, 500);
        }, 1500);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    return (
        <SafeAreaView className='bg-white h-full'>
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName='pb-28 px-5 pt-5'
                ListHeaderComponent={() => <CustomHeader title='Your Cart' />}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center py-20">
                        <Text className="text-6xl mb-4">🛒</Text>
                        <Text className="h3-bold text-dark-100 mb-2">Cart is Empty</Text>
                        <Text className="paragraph-regular text-gray-200">
                            Add items to get started
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className='gap-5'>
                        <View className='mt-6 border border-gray-200 p-5 rounded-2xl'>
                            <Text className='h3-bold text-dark-100 mb-5'>
                                Payment Summary
                            </Text>
                            <PaymentInfoStripe 
                                label={`Total Items (${totalItems})`}
                                value={`Rs ${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfoStripe 
                                label={`Delivery Fee`}
                                value={`Rs 40`}
                            />
                            <PaymentInfoStripe 
                                label={`Discount`}
                                value={`Rs 10`}
                                valueStyle='!text-success'
                            />
                            <View className='border-t border-gray-300 my-2'/>
                            <PaymentInfoStripe 
                                label={`Total`}
                                value={`Rs ${finalTotal.toFixed(2)}`}
                                labelStyle='base-bold !text-dark-100 '
                                valueStyle='base-bold !text-dark-100 !text-right'
                            />
                        </View>
                        <CustomButton 
                            title="Order Now" 
                            onPress={handleOrderNow}
                            isLoading={isProcessing}
                        />
                    </View>
                )}
            />

            <OrderConfirmationModal
                visible={showConfirmation}
                onClose={handleCloseConfirmation}
                totalAmount={confirmedOrderTotal}
            />
        </SafeAreaView>
    )
}

export default cart
// import { View, Text, FlatList } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useCartStore } from '@/store/cart.store'
// import CustomHeader from '@/components/CustomHeader'
// import cn from "clsx";
// import { PaymentInfoStripeProps } from '@/type'
// import CustomButton from '@/components/CustomButton'
// import CartItem from '@/components/CartItem'
// const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
//     <View className="flex-between flex-row my-1">
//         <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
//             {label}
//         </Text>
//         <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
//             {value}
//         </Text>
//     </View>
// );

// const cart = () => {
//   const {items,getTotalItems,getTotalPrice}=useCartStore();
//   const totalItems=getTotalItems();
//   const totalPrice=getTotalPrice();



//   return (
//     <SafeAreaView className='bg-white h-full'>
//       <FlatList
//       data={items}
//       renderItem={({item})=><CartItem item={item}/>}
//       keyExtractor={(item)=>item.id}
//       contentContainerClassName='pb-28 px-5 pt-5'
//       ListHeaderComponent={()=><CustomHeader
//       title='Your Cart'
//       />}
//       ListEmptyComponent={()=><Text>Cart Empty</Text>}
//       ListFooterComponent={()=>totalItems>0&&(
//         <View className='gap-5'>
//           <View className='mt-6 border border-gray-200 p-5 rounded-2xl'>
//             <Text className='h3-bold text-dark-100 mb-5'>
//               Payment Summary
//             </Text>
//             <PaymentInfoStripe 
//             label={`Total Items (${totalItems})`}
//             value={`Rs ${totalPrice.toFixed(2)}`}
//             />
//             <PaymentInfoStripe 
//             label={`Delivery Fee`}
//             value={`Rs 40`}
//             />
//             <PaymentInfoStripe 
//             label={`Discount`}
//             value={`Rs 10`}
//             valueStyle='!text-success'
//             />
//             <View className='border-t border-gray-300 my-2'/>
//             <PaymentInfoStripe 
//             label={`Total`}
//             value={`Rs ${(totalPrice+40-10).toFixed(2)}`}
//             labelStyle='base-bold !text-dark-100 '
//             valueStyle='base-bold !text-dark-100 !text-right'
//             />
//           </View>
//           <CustomButton title="Order Now"/>
//         </View>
//       )}
//       />
//     </SafeAreaView>
//   )
// }

// export default cart