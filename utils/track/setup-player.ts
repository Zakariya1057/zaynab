import TrackPlayer, {AppKilledPlaybackBehavior, Capability} from "react-native-track-player";

export const setupPlayer = async (): Promise<void> => {
    try {
        console.log('Setting Up Player')

        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset()
        await TrackPlayer.updateOptions({
                // Media controls capabilities
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],
                android: {
                    // This is the default behavior
                    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
                },
                // Capabilities that will show up when the notification.click is in the compact form on Android
                compactCapabilities: [Capability.Play, Capability.Pause],
            }
        )
    } catch(error: any) {
        console.log(`Failed To Set Up Player: ${error.message}`, error)
    }

}