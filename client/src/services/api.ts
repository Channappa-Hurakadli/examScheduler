// import { auth } from '../firebaseConfig';

// const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

// const getAuthToken = async () => {
//     const user = auth.currentUser;
//     if (!user) throw new Error("User not authenticated.");
//     return await user.getIdToken();
// };

// export const apiService = {
//     generate: async (module: string, formData: FormData) => {
//         const token = await getAuthToken();
//         const response = await fetch(`${API_BASE_URL}/generate/${module}`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             },
//             body: formData,
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || `Failed to generate ${module}`);
//         }
//         return response.json();
//     },

//     getHistory: async (collectionName: string) => {
//         const token = await getAuthToken();
//         const response = await fetch(`${API_BASE_URL}/history/${collectionName}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || `Failed to fetch history for ${collectionName}`);
//         }
        
//         const history = await response.json();
//         // Convert Firestore timestamp strings back to Date objects
//         return history.map((item: any) => ({
//             ...item,
//             createdAt: new Date(item.createdAt)
//         }));
//     }
// };
