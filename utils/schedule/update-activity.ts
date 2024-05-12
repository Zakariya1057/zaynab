import AsyncStorage from "@react-native-async-storage/async-storage";
import {scheduleReminder} from "@/utils/schedule/schedule-reminder";

export const updateActivity = async () => {
    const now = new Date();
    await AsyncStorage.setItem('last_active_date', now.toISOString());
    await scheduleReminder(); // Call to reschedule the notification
}