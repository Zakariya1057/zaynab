interface DownloadData {
    id: string
    updatedAt: Date
}

let activeDownload: DownloadData | null = null;

export const getActiveDownload = (): DownloadData | null => {
    return activeDownload;
}

export const clearActiveDownload = (): void => {
    console.log('Clear Active Download')
    activeDownload = null;
}

export const setActiveDownload = (id: string): void => {
    activeDownload = {
        id,
        updatedAt: new Date()
    };
}

export const updateActiveDownload = (id: string): void => {
    if (activeDownload && activeDownload.id === id) {
        activeDownload.updatedAt = new Date();
    }
}