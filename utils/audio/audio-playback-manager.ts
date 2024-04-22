import { Sound } from 'expo-av/build/Audio/Sound';

interface SoundPlaybackManager {
    currentSound: Sound | null;
    currentUrl: string;
}

const playbackManager: SoundPlaybackManager = {
    currentSound: null,
    currentUrl: '',
};

export const playNewSound = async (newSound: Sound | null, newUrl: string): Promise<Sound | null> => {
    if (playbackManager.currentUrl === newUrl && playbackManager.currentSound) {
        return playbackManager.currentSound;
    }

    if (playbackManager.currentSound && playbackManager.currentUrl !== newUrl) {
        await playbackManager.currentSound.unloadAsync();
    }

    setAudio(newSound, newUrl)

    return newSound;
};

export const setAudio = async (newSound: Sound | null, newUrl: string) => {
    playbackManager.currentSound = newSound;
    playbackManager.currentUrl = newUrl;
}