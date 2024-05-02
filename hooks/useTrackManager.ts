// hooks/useTrackManager.ts
import TrackPlayer, { usePlaybackState, useTrackPlayerEvents, State, Event } from 'react-native-track-player';
import { useCallback, useState, useEffect } from 'react';

export const useTrackManager = () => {
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [audioFailedToLoad, setAudioFailedToLoad] = useState(false);
    const { state } = usePlaybackState();
    const [buffering, setBuffering] = useState<boolean>(false);

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        if ('error' in event) {
            setAudioFailedToLoad(true);
            // showToast should be handled outside, or event can be passed back.
        } else {
            setAudioFailedToLoad(false);
        }

        setBuffering(event.state === State.Buffering);
        setAudioLoaded(event.state === State.Ready);
    });

    const togglePlayPause = useCallback(async (position: number, duration: number) => {
        if (Math.ceil(position) === Math.ceil(duration)) {
            await TrackPlayer.seekTo(0);
        }

        if (state !== State.Playing) {
            TrackPlayer.play();
        } else {
            TrackPlayer.pause();
        }
    }, [state]);

    return { togglePlayPause, audioLoaded, buffering, audioFailedToLoad, setAudioFailedToLoad };
}
