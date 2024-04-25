import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { DownloadModel } from "@/utils/database/models/download-model";

interface QueueItem {
    episodeId: string;
    download: Partial<DownloadModel>;
}

interface QueueContextType {
    isInQueue: (episodeId: string) => boolean;
    removeFromQueue: (episodeId: string) => void;
    addToQueue: (episodeId: string, download: Partial<DownloadModel>) => void;
    queueEmpty: () => boolean;
    getNextItem: () => QueueItem | undefined;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const QueueProvider: React.FC<Props> = ({children}) => {
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const addToQueue = (episodeId: string, download: Partial<DownloadModel>) => {
        setQueue(prevQueue => {
            return [...prevQueue, { episodeId, download }]
        });
        console.log(episodeId)
    };

    const removeFromQueue = (episodeId: string) => {
        setQueue(prevQueue => {
            return prevQueue.filter(item => item.episodeId !== episodeId)
        });
    };

    const isInQueue = (episodeId: string): boolean => {
        return queue.some(item => item.episodeId === episodeId);
    };

    const queueEmpty = (): boolean => {
        return queue.length === 0;
    };

    const getNextItem = (): QueueItem | undefined => {
        return queue[0];
    };

    return (
        <QueueContext.Provider value={{
            isInQueue,
            removeFromQueue,
            addToQueue,
            queueEmpty,
            getNextItem
        }}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};
