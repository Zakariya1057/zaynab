import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchShuffleStatus = async (): Promise<boolean> => {
    try {
        const status = await AsyncStorage.getItem('shuffleStatus');
        // Check if status is null, then return null
        if (status === null) return false;
        // Otherwise, convert the string status to boolean
        return status === 'true';
    } catch (error) {
        console.log("Error fetching shuffle status: ", error);
        return false;
    }
};
