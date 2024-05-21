import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "react-native-track-player";
import { getSpeedFromStorage } from "@/utils/speed/speed-storage";

let playerSetup = false;

export const setupPlayer = async (): Promise<void> => {
    if (playerSetup) return;

    try {
        console.log('Setting Up Player');

        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset();
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
                Capability.SeekTo,
                Capability.JumpForward,
                Capability.JumpBackward,
            ],

            forwardJumpInterval: 15,
            backwardJumpInterval: 15,

            android: {
                alwaysPauseOnInterruption: true,
                appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },

            progressUpdateEventInterval: 1,

            // Capabilities that will show up when the notification.click is in the compact form on Android
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
                Capability.SeekTo,
                Capability.JumpForward,
                Capability.JumpBackward,
            ],
        });

        const rate = await getSpeedFromStorage() ?? 1;
        await TrackPlayer.setRate(rate);

        playerSetup = true;
    } catch (error) {
        console.log(`Failed To Set Up Player: ${error.message}`, error);
    }
}
