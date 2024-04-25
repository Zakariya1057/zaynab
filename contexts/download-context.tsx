import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

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
        setActiveDownloads(prev => new Set(prev.add(episodeId)));
    };

    const removeDownload = (episodeId: string) => {
        setActiveDownloads(prev => {
            const updated = new Set(prev);
            updated.delete(episodeId);
            return updated;
        });
    };

    const isDownloading = (episodeId: string): boolean => {
        console.log('Active', activeDownloads);
        return activeDownloads.has(episodeId);
    };

    return (
        <DownloadContext.Provider value={{
            activeDownloads,
            addDownload,
            removeDownload,
            isDownloading,
        }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownloads = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownloads must be used within a DownloadProvider');
    }
    return context;
};
