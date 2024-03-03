import React, {useState, useEffect, useCallback} from 'react';
import {AVPlaybackStatus, Audio, InterruptionModeIOS, InterruptionModeAndroid} from 'expo-av';
import {playNewSound, setAudio} from "../../utils/audio/audio-playback-manager";

interface CustomAudioPlayerProps {
    url: string;
    speed?: number;
    onProgressUpdate: (positionMillis: number, durationMillis?: number) => void;
}

export const useCustomAudioPlayer = ({url, speed = 1.0, onProgressUpdate}: CustomAudioPlayerProps) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        Audio.setAudioModeAsync({
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: false,
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const initializeSound = async () => {
            let soundToUse = await playNewSound(null, url);
            if (!soundToUse) {
                const {sound: newSound} = await Audio.Sound.createAsync(
                    { uri: url },
                    {shouldPlay: isPlaying, rate: speed, isMuted: false}
                );

                soundToUse = newSound;
                setAudio(newSound, url); // Assuming this updates the global state or context
            }
            soundToUse.setOnPlaybackStatusUpdate(onUpdate);
            setSound(soundToUse);
        };

        initializeSound().catch(console.error);

        // return () => sound?.unloadAsync();
    }, [url, isPlaying, speed]);

    const onUpdate = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            onProgressUpdate(status.positionMillis, status.durationMillis);
            setIsPlaying(status.isPlaying);
        }
    }, [onProgressUpdate]);

    const togglePlayPause = useCallback(async () => {
        if (!sound) return;
        const status = await (isPlaying ? sound.pauseAsync() : sound.playAsync());
        setIsPlaying(!status.isPlaying);
    }, [isPlaying, sound]);

    const skipToTime = useCallback(async (timeInMillis: number) => {
        if (!sound) return;
        await sound.setPositionAsync(timeInMillis);
        if (isPlaying) {
            await sound.playAsync();
        }
    }, [sound, isPlaying]);

    useEffect(() => {
        sound?.setRateAsync(speed, true)
    }, [speed])

    return {togglePlayPause, isPlaying, skipToTime};
};
