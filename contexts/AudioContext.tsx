import React, {createContext, useCallback, useContext, useState} from 'react';
import { useAudioPlayer } from "../hooks/audio/useAudioPlayer";
import { AudioPlayerState } from "../hooks/audio/useAudioPlayer"

type State = AudioPlayerState & { changeAudio: (newUrl: string) => void }

// Now the context is typed with the correct return type or null
const AudioContext = createContext<State>({} as State);

export const useAudio = () => useContext<State>(AudioContext);

export const AudioProvider: React.FC = ({ children }) => {
    // const [audioUrl, setAudioUrl] = useState<string>("https://ia803402.us.archive.org/12/items/TearfulMomentsOfTheProphetsLife-YahyaIbrahim-Lezing/TearfulMomentsOfTheProphetsLifeYahyaIbrahim1.mp3");
    // const [audioUrl, setAudioUrl] = useState<string>("https://otxnqbrbmgrjoqeyfput.supabase.co/storage/v1/object/public/audio/Smaller.m4a?t=2024-02-14T03%3A30%3A08.940Z");
    const [audioUrl, setAudioUrl] = useState<string>("https://otxnqbrbmgrjoqeyfput.supabase.co/storage/v1/object/public/audio/Smaller.m4a?t=2024-02-14T03%3A30%3A08.940Z");
    // const [audioUrl, setAudioUrl] = useState<string>("https://archive.org/download/UndrShdsSwrds/Under_the_Shades_of_Swords.mp3");
    const audioPlayer = useAudioPlayer(audioUrl);

    const changeAudio = useCallback((newUrl: string) => {
        setAudioUrl(newUrl);
    }, []);

    const value = { ...audioPlayer, changeAudio };

    return (
        <AudioContext.Provider value={{ ...audioPlayer, changeAudio }}>
            {children}
        </AudioContext.Provider>
    );
};
