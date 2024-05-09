import AsyncStorage from '@react-native-async-storage/async-storage';

const SPEED_KEY = 'PLAYBACK_SPEED';

export const saveSpeedToStorage = async (speed: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(SPEED_KEY, JSON.stringify(speed));
    } catch (error) {
        console.error('Failed to save speed to storage', error);
    }
};

export const getSpeedFromStorage = async (): Promise<number | null> => {
    try {
        const value = await AsyncStorage.getItem(SPEED_KEY);
        return value ? JSON.parse(value) : 1; // Default to 1 if nothing is stored
    } catch (error) {
        console.error('Failed to retrieve speed from storage', error);
        return null;
    }
};
