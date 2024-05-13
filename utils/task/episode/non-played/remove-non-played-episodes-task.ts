import * as BackgroundFetch from 'expo-background-fetch';
import { DELETE_OLD_EPISODES_TASK } from "@/utils/task/task-names";

export const removeNonPlayedEpisodesTask = async () => {
    try {
        await BackgroundFetch.unregisterTaskAsync(DELETE_OLD_EPISODES_TASK);
        console.log('Task unregistered successfully');
    } catch (err) {
        console.log('Failed to unregister task:', err);
    }
}
