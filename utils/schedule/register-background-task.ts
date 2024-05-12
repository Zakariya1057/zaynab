import * as TaskManager from 'expo-task-manager';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASK_NAME = 'CHECK_EPISODE_INACTIVITY';

// Register the background task
async function registerBackgroundTask() {
    TaskManager.defineTask(TASK_NAME, async ({data, error}) => {

        if (error) {
            // Error occurred - check `error.message` for more details.
            return;
        }
        if (data) {
            // const { locations } = data;
            // do something with the locations captured in the background
        }

        // try {
        //     const keys = await AsyncStorage.getAllKeys();
        //     const episodeKeys = keys.filter(key => key.startsWith('episode_start:'));
        //     episodeKeys.forEach(async key => {
        //         const episodeId = key.split(':')[1];
        //         await scheduleReminder(episodeId);
        //     return TaskManager.TaskCompletedResult.NewData;
        // } catch (err) {
        //     return TaskManager.TaskCompletedResult.Failed;
        // // }
    });

    //
    // await TaskManager.registerTaskAsync(TASK_NAME, {
    //     minimumInterval: 60 * 60 * 24, // once a day
    //     stopOnTerminate: false, // whether the task should be stopped when the app is terminated
    //     startOnBoot: true, // whether the task should start on device reboot
    // });
}
