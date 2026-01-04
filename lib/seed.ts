import { ID } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[];
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    try {
        const list = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId
        );

        await Promise.all(
            list.documents.map((doc) =>
                databases.deleteDocument(
                    appwriteConfig.databaseId,
                    collectionId,
                    doc.$id
                )
            )
        );
    } catch (error) {
        console.log(`Warning: Could not clear collection ${collectionId}:`, error);
    }
}

async function seed(): Promise<void> {
    try {
        console.log("🌱 Starting seed process...");

        // 1. Clear all collections
        console.log("🗑️  Clearing existing data...");
        await clearAll(appwriteConfig.categoriesCollectionId);
        await clearAll(appwriteConfig.customizationsCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);

        // 2. Create Categories
        console.log("📁 Creating categories...");
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            try {
                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.categoriesCollectionId,
                    ID.unique(),
                    {
                        name: cat.name,
                        description: cat.description
                    }
                );
                categoryMap[cat.name] = doc.$id;
                console.log(`  ✓ Created category: ${cat.name}`);
            } catch (error) {
                console.error(`  ✗ Failed to create category ${cat.name}:`, error);
            }
        }

        // 3. Create Customizations
        console.log("🎨 Creating customizations...");
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            try {
                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.customizationsCollectionId,
                    ID.unique(),
                    {
                        name: cus.name,
                        price: cus.price,
                        type: cus.type,
                    }
                );
                customizationMap[cus.name] = doc.$id;
                console.log(`  ✓ Created customization: ${cus.name}`);
            } catch (error) {
                console.error(`  ✗ Failed to create customization ${cus.name}:`, error);
            }
        }

        // 4. Create Menu Items
        console.log("🍔 Creating menu items...");
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            try {
                const categoryId = categoryMap[item.category_name];
                if (!categoryId) {
                    console.warn(`  ⚠️  Category ${item.category_name} not found for ${item.name}`);
                }

                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    ID.unique(),
                    {
                        name: item.name,
                        description: item.description,
                        image_url: item.image_url, // Store URL directly - no upload
                        price: item.price,
                        rating: item.rating,
                        calories: item.calories,
                        protein: item.protein,
                        categories: categoryId,
                    }
                );

                menuMap[item.name] = doc.$id;
                console.log(`  ✓ Created menu item: ${item.name}`);

                // 5. Create menu_customizations relationships
                console.log(`  Creating customizations for ${item.name}...`);
                for (const cusName of item.customizations) {
                    const customizationId = customizationMap[cusName];
                    if (!customizationId) {
                        console.warn(`    ⚠️  Customization ${cusName} not found`);
                        continue;
                    }

                    try {
                        await databases.createDocument(
                            appwriteConfig.databaseId,
                            appwriteConfig.menuCustomizationsCollectionId,
                            ID.unique(),
                            {
                                menu: doc.$id,
                                customizations: customizationId,
                            }
                        );
                        console.log(`    ✓ Linked customization: ${cusName}`);
                    } catch (error) {
                        console.error(`    ✗ Failed to link customization ${cusName}:`, error);
                    }
                }
            } catch (error) {
                console.error(`  ✗ Failed to create menu item ${item.name}:`, error);
            }
        }

        console.log("✅ Seeding complete!");
        console.log(`📊 Summary:`);
        console.log(`   Categories: ${Object.keys(categoryMap).length}`);
        console.log(`   Customizations: ${Object.keys(customizationMap).length}`);
        console.log(`   Menu Items: ${Object.keys(menuMap).length}`);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}

export default seed;
// import { ID } from "react-native-appwrite";
// import { appwriteConfig, databases, storage } from "./appwrite";
// import dummyData from "./data";

// interface Category {
//     name: string;
//     description: string;
// }

// interface Customization {
//     name: string;
//     price: number;
//     type: "topping" | "side" | "size" | "crust" | string;
// }

// interface MenuItem {
//     name: string;
//     description: string;
//     image_url: string;
//     price: number;
//     rating: number;
//     calories: number;
//     protein: number;
//     category_name: string;
//     customizations: string[];
// }

// interface DummyData {
//     categories: Category[];
//     customizations: Customization[];
//     menu: MenuItem[];
// }

// const data = dummyData as DummyData;

// async function clearAll(collectionId: string): Promise<void> {
//     const list = await databases.listDocuments(
//         appwriteConfig.databaseId,
//         collectionId
//     );

//     await Promise.all(
//         list.documents.map((doc) =>
//             databases.deleteDocument(
//                 appwriteConfig.databaseId,
//                 collectionId,
//                 doc.$id
//             )
//         )
//     );
// }

// async function clearStorage(): Promise<void> {
//     const list = await storage.listFiles(appwriteConfig.bucketId);

//     await Promise.all(
//         list.files.map((file) =>
//             storage.deleteFile(appwriteConfig.bucketId, file.$id)
//         )
//     );
// }

// async function uploadImageToStorage(imageUrl: string) {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();

//     const fileObj = {
//         name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
//         type: blob.type,
//         size: blob.size,
//         uri: imageUrl,
//     };

//     // Use object parameter syntax for Appwrite SDK v14+
//     const file = await storage.createFile(
//         appwriteConfig.bucketId,
//         ID.unique(),
//         fileObj as any // Type assertion for file object
//     );

//     return storage.getFileView(appwriteConfig.bucketId, file.$id);
// }

// async function seed(): Promise<void> {
//     try {
//         console.log("🌱 Starting seed process...");

//         // 1. Clear all collections and storage
//         console.log("🗑️  Clearing existing data...");
//         await clearAll(appwriteConfig.categoriesCollectionId);
//         await clearAll(appwriteConfig.customizationsCollectionId);
//         await clearAll(appwriteConfig.menuCollectionId);
//         await clearAll(appwriteConfig.menuCustomizationsCollectionId);
//         await clearStorage();

//         // 2. Create Categories
//         console.log("📁 Creating categories...");
//         const categoryMap: Record<string, string> = {};
//         for (const cat of data.categories) {
//             const doc = await databases.createDocument(
//                 appwriteConfig.databaseId,
//                 appwriteConfig.categoriesCollectionId,
//                 ID.unique(),
//                 cat
//             );
//             categoryMap[cat.name] = doc.$id;
//         }

//         // 3. Create Customizations
//         console.log("🎨 Creating customizations...");
//         const customizationMap: Record<string, string> = {};
//         for (const cus of data.customizations) {
//             const doc = await databases.createDocument(
//                 appwriteConfig.databaseId,
//                 appwriteConfig.customizationsCollectionId,
//                 ID.unique(),
//                 {
//                     name: cus.name,
//                     price: cus.price,
//                     type: cus.type,
//                 }
//             );
//             customizationMap[cus.name] = doc.$id;
//         }

//         // 4. Create Menu Items
//         console.log("🍔 Creating menu items...");
//         const menuMap: Record<string, string> = {};
//         for (const item of data.menu) {
//             console.log(`  Uploading image for ${item.name}...`);
//             const uploadedImage = await uploadImageToStorage(item.image_url);

//             const doc = await databases.createDocument(
//                 appwriteConfig.databaseId,
//                 appwriteConfig.menuCollectionId,
//                 ID.unique(),
//                 {
//                     name: item.name,
//                     description: item.description,
//                     image_url: uploadedImage,
//                     price: item.price,
//                     rating: item.rating,
//                     calories: item.calories,
//                     protein: item.protein,
//                     categories: categoryMap[item.category_name],
//                 }
//             );

//             menuMap[item.name] = doc.$id;

//             // 5. Create menu_customizations relationships
//             console.log(`  Creating customizations for ${item.name}...`);
//             for (const cusName of item.customizations) {
//                 await databases.createDocument(
//                     appwriteConfig.databaseId,
//                     appwriteConfig.menuCustomizationsCollectionId,
//                     ID.unique(),
//                     {
//                         menu: doc.$id,
//                         customizations: customizationMap[cusName],
//                     }
//                 );
//             }
//         }

//         console.log("✅ Seeding complete!");
//     } catch (error) {
//         console.error("❌ Seeding failed:", error);
//         throw error;
//     }
// }

// export default seed;
// import { ID } from "react-native-appwrite";
// import { appwriteConfig, databases, storage } from "./appwrite";
// import dummyData from "./data";

// interface Category {
//     name: string;
//     description: string;
// }

// interface Customization {
//     name: string;
//     price: number;
//     type: "topping" | "side" | "size" | "crust" | string; // extend as needed
// }

// interface MenuItem {
//     name: string;
//     description: string;
//     image_url: string;
//     price: number;
//     rating: number;
//     calories: number;
//     protein: number;
//     category_name: string;
//     customizations: string[]; // list of customization names
// }

// interface DummyData {
//     categories: Category[];
//     customizations: Customization[];
//     menu: MenuItem[];
// }

// // ensure dummyData has correct shape
// const data = dummyData as DummyData;

// async function clearAll(collectionId: string): Promise<void> {
//     const list = await databases.listDocuments(
//         appwriteConfig.databaseId,
//         collectionId
//     );

//     await Promise.all(
//         list.documents.map((doc) =>
//             databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
//         )
//     );
// }

// async function clearStorage(): Promise<void> {
//     const list = await storage.listFiles(appwriteConfig.bucketId);

//     await Promise.all(
//         list.files.map((file) =>
//             storage.deleteFile(appwriteConfig.bucketId, file.$id)
//         )
//     );
// }

// async function uploadImageToStorage(imageUrl: string) {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();

//     const fileObj = {
//         name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
//         type: blob.type,
//         size: blob.size,
//         uri: imageUrl,
//     };

//     const file = await storage.createFile(
//         appwriteConfig.bucketId,
//         ID.unique(),
//         fileObj
//     );

//     return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
// }

// async function seed(): Promise<void> {
//     // 1. Clear all
//     await clearAll(appwriteConfig.categoriesCollectionId);
//     await clearAll(appwriteConfig.customizationsCollectionId);
//     await clearAll(appwriteConfig.menuCollectionId);
//     await clearAll(appwriteConfig.menuCustomizationsCollectionId);
//     await clearStorage();

//     // 2. Create Categories
//     const categoryMap: Record<string, string> = {};
//     for (const cat of data.categories) {
//         const doc = await databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.categoriesCollectionId,
//             ID.unique(),
//             cat
//         );
//         categoryMap[cat.name] = doc.$id;
//     }

//     // 3. Create Customizations
//     const customizationMap: Record<string, string> = {};
//     for (const cus of data.customizations) {
//         const doc = await databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.customizationsCollectionId,
//             ID.unique(),
//             {
//                 name: cus.name,
//                 price: cus.price,
//                 type: cus.type,
//             }
//         );
//         customizationMap[cus.name] = doc.$id;
//     }

//     // 4. Create Menu Items
//     const menuMap: Record<string, string> = {};
//     for (const item of data.menu) {
//         const uploadedImage = await uploadImageToStorage(item.image_url);

//         const doc = await databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.menuCollectionId,
//             ID.unique(),
//             {
//                 name: item.name,
//                 description: item.description,
//                 image_url: uploadedImage,
//                 price: item.price,
//                 rating: item.rating,
//                 calories: item.calories,
//                 protein: item.protein,
//                 categories: categoryMap[item.category_name],
//             }
//         );

//         menuMap[item.name] = doc.$id;

//         // 5. Create menu_customizations
//         for (const cusName of item.customizations) {
//             await databases.createDocument(
//                 appwriteConfig.databaseId,
//                 appwriteConfig.menuCustomizationsCollectionId,
//                 ID.unique(),
//                 {
//                     menu: doc.$id,
//                     customizations: customizationMap[cusName],
//                 }
//             );
//         }
//     }

//     console.log("✅ Seeding complete.");
// }

// export default seed;