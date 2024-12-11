import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const getMainPhotos = async () => {

    const listRef = ref(storage, 'main/fotos');
    try {
        const res = await listAll(listRef);
        const photos = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                var photo = {
                    name: itemRef.name,
                    alt: itemRef.name.split('.')[0],
                    dateCreated: "2015-01-01",
                    url: url,
                    mediaType: "img"
                }
                return photo;
            })
        );
        return photos;
    } catch (error) {
        console.error("Error fetching URLs:", error);
    }
};

export const getMainVideos = async () => {
    const listRef = ref(storage, 'main/videos');
    // Find all the prefixes and items.
    try {
        const res = await listAll(listRef);
        const videos = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                console.log("Res name: ", itemRef.name);
                console.log("Url: ", url);
                var video = {
                    name: itemRef.name,
                    alt: itemRef.name.split('.')[0],
                    dateCreated: "2015-01-01",
                    url: url,
                    mediaType: "video"
                }
                return video;
            })
        );
        return videos;
    } catch (error) {
        console.error("Error fetching URLs:", error);
    }
};


export const getCategoryPhotos = async (category) => {
    console.log("In get category photos")
    const listRef = ref(storage, `fotos/${category}`);

    // Find all the prefixes and items.
    try {
        const res = await listAll(listRef);
        const urls = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                console.log("Res name: ", itemRef.name);
                console.log("Url: ", url);
                return url;
            })
        );
        return urls;
    } catch (error) {
        console.error("Error fetching URLs:", error);
    }
};


export const getCategoryVideos = async (category) => {
    console.log("In get category videos")
    const listRef = ref(storage, `video/${category}`);

    // Find all the prefixes and items.
    try {
        const res = await listAll(listRef);
        const urls = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                console.log("Res name: ", itemRef.name);
                console.log("Url: ", url);
                return url;
            })
        );
        return urls;
    } catch (error) {
        console.error("Error fetching URLs:", error);
    }
};