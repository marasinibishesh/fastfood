import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
export const appwriteConfig={
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform:"com.ffn.fastfoodnepal",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId:'695504c50013ab75005e',
    userCollectionId:'user',
    categoriesCollectionId:'categories',
    menuCollectionId:'menu',
    customizationsCollectionId:'customizations',
    menuCustomizationCollectionId:'menu_customizations'
}

export const client=new Client();

client
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setPlatform(appwriteConfig.platform)

export const account= new Account(client);
export const databases= new Databases(client);
const avatars= new Avatars(client);

export const createUser=async({email,password,name}:CreateUserParams)=>{
   try{
    //  const newAccount=await account.create(ID.unique(),email,password,name)
    const newAccount = await account.create({
  userId: ID.unique(),
  email: email,
  password: password,
  name: name
})

if(!newAccount) throw Error;
await signIn({
    email,password
});

const avatarUrl=avatars.getInitialsURL(name);

return await databases.createDocument({
  databaseId: appwriteConfig.databaseId,
  collectionId: appwriteConfig.userCollectionId, // Your users collection ID
  documentId: ID.unique(), // Generate unique ID
  data: {
    accountId: newAccount.$id,
    email: email,
    name: name,
    avatar:avatarUrl
    // Add any other user fields you need
  }
});

   }
   catch(e){
    throw new Error(e as string)
   }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession({
      email: email,
      password: password
    });
    return session;
  } catch (e) {
    throw new Error(e as string);
  }
}

export const getCurrentUser=async()=>{
    try{
        const currentAccount=await account.get();
        if(!currentAccount) throw Error;

        const currentUser=await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

       if(!currentUser) throw Error;
       return currentUser.documents[0];



    } catch(e){
        console.log(e)
        throw new Error(e as string);
    }
}