import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DownloadResumable } from "expo-file-system";

interface DownloadContextType {
    addToDeleted: (episodeId: string) => void;
    isDeleted: (episodeId: string) => boolean;

    addDownload: (episodeId: string) => void;
    removeDownload: (episodeId: string) => void;
    isDownloading: (episodeId: string) => boolean;
    setDownloadResumable: (episodeId: string, resumable: DownloadResumable | null) => void; // Updated function to set download resumable
    getDownloadResumable: (episodeId: string) => DownloadResumable | null; // Updated function to get download resumable
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const DownloadProvider: React.FC<Props> = ({ children }) => {
    const [activeDownloads, setActiveDownloads] = useState<Set<string>>(new Set());
    const [deleted, setDeleted] = useState<Set<string>>(new Set());
    const [downloadResumables, setDownloadResumables] = useState<Map<string, DownloadResumable | null>>(new Map());

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
        return activeDownloads.has(episodeId);
    };

    const setDownloadResumable = (episodeId: string, resumable: DownloadResumable | null) => {
        setDownloadResumables(prev => new Map(prev.set(episodeId, resumable)));
    };

    const getDownloadResumable = (episodeId: string): DownloadResumable | null => {
        return downloadResumables.get(episodeId) ?? null;
    };

    const addToDeleted = (episodeId: string) => {
        setDeleted(prev => new Set(prev.add(episodeId)));
    }

    const isDeleted = (episodeId: string) => {
        return deleted.has(episodeId);
    }

    return (
        <DownloadContext.Provider value={{
            addDownload,
            removeDownload,
            isDownloading,
            setDownloadResumable,
            getDownloadResumable,
            addToDeleted,
            isDeleted,
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
