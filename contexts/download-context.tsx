import React, {createContext, useContext, useState, ReactNode} from 'react';

interface DownloadContextType {
    activeDownloads: Set<string>;
    addDownload: (episodeId: string) => void;
    removeDownload: (episodeId: string) => void;
    isDownloading: (episodeId: string) => boolean;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const DownloadProvider: React.FC<Props> = ({children}) => {
    const [activeDownloads, setActiveDownloads] = useState<Set<string>>(new Set());

    const addDownload = (episodeId: string) => {
        setActiveDownloads(new Set(activeDownloads.add(episodeId)));
    };

    const removeDownload = (episodeId: string) => {
        activeDownloads.delete(episodeId);
        setActiveDownloads(new Set(activeDownloads));
    };

    const isDownloading = (episodeId: string): boolean => {
        return activeDownloads.has(episodeId);
    };

    return (
        <DownloadContext.Provider value={{activeDownloads, addDownload, removeDownload, isDownloading}}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownloads = () => {
    const context = useContext(DownloadContext);
    if (context === undefined) {
        throw new Error('useDownloads must be used within a DownloadProvider');
    }
    return context;
};
