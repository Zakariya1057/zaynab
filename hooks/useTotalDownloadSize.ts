import {useState, useEffect, useCallback} from 'react';
import {getTotalDownloadSize} from "@/utils/database/download/get-total-download-size";
import {formatBytes} from "@/utils/format/format-bytes";

/**
 * Custom hook to fetch and manage the total download size of downloads in progress.
 * Provides loading state, error handling, and retry functionality.
 * @returns An object containing the total download size, loading state, error state, and a retry function.
 */
export const useTotalDownloadSize = () => {
    const [totalSize, setTotalSize] = useState<string>('0 bytes');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchTotalDownloadSize = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const size = await getTotalDownloadSize();
            setTotalSize(formatBytes(size));
        } catch (error) {
            console.error('Failed to fetch total download size:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTotalDownloadSize();
    }, [fetchTotalDownloadSize]);

    const retry = async () => {
        await fetchTotalDownloadSize();
    };

    return {
        totalSize,
        loading,
        error,
        retry
    };
};