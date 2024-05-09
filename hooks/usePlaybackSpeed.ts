import { useEffect, useState } from 'react';
import TrackPlayer from "react-native-track-player";
import { getSpeedFromStorage, saveSpeedToStorage } from "@/utils/speed/speed-storage";

// Updated list of speed settings
const defaultSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const usePlaybackSpeed = () => {
    const [speed, setSpeed] = useState<number>(1);  // Normal speed as default
    const [speeds, setSpeeds] = useState<number[]>(defaultSpeeds);

    useEffect(() => {
        const fetchSpeed = async () => {
            const storedSpeed = await getSpeedFromStorage();
            if (storedSpeed !== null) {
                setSpeed(storedSpeed);
                await TrackPlayer.setRate(storedSpeed);
            }
        };

        fetchSpeed();
    }, []);

    const cycleSpeed = async () => {
        const currentIndex = speeds.indexOf(speed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        setSpeed(newSpeed);
        await TrackPlayer.setRate(newSpeed);
        await saveSpeedToStorage(newSpeed);
    };

    return {
        speed,
        cycleSpeed
    };
};
