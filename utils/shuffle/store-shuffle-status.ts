import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeShuffleStatus = async (status: boolean): Promise<void> => {
    try {
        // Convert the boolean status to a string before storing
        const statusString = status ? 'true' : 'false';
        await AsyncStorage.setItem('shuffleStatus', statusString);
    } catch (error) {
        console.log("Error storing shuffle status: ", error);
    }
};
