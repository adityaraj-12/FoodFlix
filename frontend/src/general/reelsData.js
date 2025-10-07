// Fetch reels data from backend API
// Each reel: { id, videoUrl, userName (food partner), description, storeUrl }

// export async function fetchReelsData() {
//   try {
//     const res = await axios.get('http://localhost:3000/api/food'); // Adjust endpoint as needed
//     if (!res.ok) throw new Error('Failed to fetch reels');
//     const data = await res.json();
//     // data should be an array of { id, videoUrl, userName, description, storeUrl }
//     return data;
//   } catch (err) {
//     console.error('Error fetching reels:', err);
//     return [];
//   }
// }

import axios from 'axios';

export async function fetchReelsData() {
    try {
        const res = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
        // Expecting res.data.foodItem to be an array of food items
        const items = Array.isArray(res.data.foodItem) ? res.data.foodItem : [res.data.foodItem];
        const data = items
            .filter(item => item && item.video && item.foodPartner && item.description)
            .map(item => ({
                id: item._id,
                videoUrl: item.video,
                userName: item.foodPartner.name,
                description: item.description,
                storeUrl: item.foodPartner._id,
                likes: item.likeCount || 0,
                saves: item.saveCount || 0,
                comments: item.commentCount || 0,
            }));
        return data;
    } catch (err) {
        console.error('Error fetching reels:', err);
        return [];
    }
}


