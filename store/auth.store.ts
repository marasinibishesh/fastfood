import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create, StoreApi, UseBoundStore } from 'zustand';

type AuthState={
    isAuthenticated:boolean;           // ✅ Your original
    user: User | null;                 // ✅ Your original
    isLoading:boolean;                 // ✅ Your original

    setIsAuthenticated:(value:boolean)=>void;  // ✅ Your original
    setUser:(user:User|null)=>void;            // ✅ Your original
    setLoading:(loading:boolean)=>void;        // ✅ Your original

    fetchAuthenticatedUser:()=> Promise<void>; // ✅ Your original
    logout:()=>void;                           // ⭐ NEW - Only this line added
}

const useAuthStore:UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set) => ({
    isAuthenticated:false,    // ✅ Your original
    user:null,                // ✅ Your original
    isLoading:true,           // ✅ Your original

    setIsAuthenticated:(value)=>set({isAuthenticated:value}),  // ✅ Your original
    setUser:(user)=>set({user}),                               // ✅ Your original
    setLoading:(value)=>set({isLoading:value}),                // ✅ Your original

    // ✅ Your original fetchAuthenticatedUser - UNCHANGED
    fetchAuthenticatedUser:async()=>{
        set({isLoading:true});

        try{
            const user=await getCurrentUser();
            if(user) set({isAuthenticated:true,user: user as unknown as User})
            else set({isAuthenticated:false,user:null})
        }catch(e){
            console.log('fetchAuthenticatedUser error',e);
            set({isAuthenticated:false,user:null})
        }finally{
          set({isLoading:false})
        }
    },

    // ⭐ NEW - Only this function is added
    logout:()=>{
        set({
            isAuthenticated:false,
            user:null
        });
    }
}))

export default useAuthStore;


// import { getCurrentUser } from '@/lib/appwrite';
// import { User } from '@/type';
// import { create, StoreApi, UseBoundStore } from 'zustand';


// type AuthState={
//     isAuthenticated:boolean;
//     user: User | null;
//     isLoading:boolean;

//     setIsAuthenticated:(value:boolean)=>void;
//     setUser:(user:User|null)=>void;
//     setLoading:(loading:boolean)=>void;

//     fetchAuthenticatedUser:()=> Promise<void>;
// }

// const useAuthStore:UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set) => ({
//     isAuthenticated:false,
//     user:null,
//     isLoading:true,

//     setIsAuthenticated:(value)=>set({isAuthenticated:value}),
//     setUser:(user)=>set({user}),
//     setLoading:(value)=>set({isLoading:value}),

//     fetchAuthenticatedUser:async()=>{
//         set({isLoading:true});

//         try{
//             const user=await getCurrentUser();
//             if(user) set({isAuthenticated:true,user: user as unknown as User})
//         else set({isAuthenticated:false,user:null})
//         }catch(e){
//                 console.log('fetchAuthenticatedUser error',e);
//                 set({isAuthenticated:false,user:null})
//         }finally{
//           set({isLoading:false})
//         }
//     }
// }))

// export default useAuthStore;