import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';

interface AudioPlaybackContextType {
    shouldAutoPlayAudio: boolean;
    setShouldAutoPlayAudio: (value: boolean) => void;
    getShouldAutoPlayAudio: () => boolean;
}

const AudioPlaybackContext = createContext<AudioPlaybackContextType | undefined>(undefined);

interface AudioProviderProps {
    children: ReactNode;
}

export const AudioPlaybackProvider: React.FC<AudioProviderProps> = ({children}) => {
    const [shouldAutoPlayAudio, setShouldAutoPlayAudio] = useState(false);

    useEffect(() => {
        // Initialize your state here
        setShouldAutoPlayAudio(false);  // Default to false on app start
    }, []);

    const getShouldAutoPlayAudio = () => shouldAutoPlayAudio;

    return (
        <AudioPlaybackContext.Provider value={{shouldAutoPlayAudio, setShouldAutoPlayAudio, getShouldAutoPlayAudio}}>
            {children}
        </AudioPlaybackContext.Provider>
    );
};

export const useAudioPlayback = () => {
    const context = useContext(AudioPlaybackContext);
    if (!context) {
        throw new Error('useAudioPlayback must be used within an AudioPlaybackProvider');
    }
    return context;
};
