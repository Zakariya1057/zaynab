import { useState, useCallback } from 'react';
import { useCustomAudioPlayer } from './useCustomAudioPlayer';
import {formatDuration} from "../../utils/time/format-duration";

export interface AudioPlayerState {
    currentTime: string;
    endTime: string;
    sliderValue: number;
    isPlaying: boolean;
    speed: number
    setSpeed: (speed: number) => void
    togglePlayPause: () => Promise<void>;
    handleSliderChangeStart: () => void;
    handleSliderValueChange: (value: number) => void;
    handleSliderChangeComplete: (value: number) => void;
}

export const useAudioPlayer = (audioUrl: string): AudioPlayerState => {
    const [currentTime, setCurrentTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:00');
    const [sliderValue, setSliderValue] = useState(0); // Direct slider position
    const [isUserInteracting, setIsUserInteracting] = useState(false); // Track user interaction
    const [totalDuration, setTotalDuration] = useState(0);
    const [speed, setSpeed] = useState(1)

    const onProgressUpdate = useCallback((currentProgress: number, duration?: number) => {
        if (duration) {
            setTotalDuration(duration);
            if (!isUserInteracting) {
                // Only update slider value if the user is not currently interacting with it
                setSliderValue(currentProgress / duration);
            }
            setCurrentTime(formatDuration(currentProgress));
            setEndTime(formatDuration(duration-currentProgress));
        }
    }, [isUserInteracting]);

    const { togglePlayPause, skipToTime, isPlaying: isAudioPlaying } = useCustomAudioPlayer({
        url: audioUrl,
        speed,
        onProgressUpdate,
    });

    const handleSliderChangeStart = () => {
        setIsUserInteracting(true);

        if (isAudioPlaying) {
            togglePlayPause()
        }
    }

    const handleSliderValueChange = useCallback((value: number) => {
        setSliderValue(value);
        setIsUserInteracting(false);
        setCurrentTime(formatDuration(value * totalDuration)); // Optionally update current time immediately
        setEndTime(formatDuration( totalDuration-(value * totalDuration) ));
    }, [totalDuration]);

    const handleSliderChangeComplete = useCallback((value: number) => {
        const newTime = value * totalDuration;
        skipToTime(newTime).then(() => {
            setIsUserInteracting(false); // Reset interaction flag after skip
        });
        togglePlayPause()
    }, [totalDuration, skipToTime]);

    return {
        currentTime,
        endTime,
        sliderValue,
        speed,
        setSpeed,
        isPlaying: isAudioPlaying && !isUserInteracting,
        togglePlayPause,
        handleSliderChangeStart,
        handleSliderValueChange,
        handleSliderChangeComplete,
    };
};
