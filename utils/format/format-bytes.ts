/**
 * Converts bytes into a more readable format (MB or GB).
 * @param bytes - The size in bytes.
 * @returns A formatted string representing the size in MB or GB.
 */
export const formatBytes = (bytes: number): string => {
    if (bytes >= 1e9) { // Gigabytes
        return (bytes / 1e9).toFixed(2) + ' GB';
    } else if (bytes >= 1e6) { // Megabytes
        return (bytes / 1e6).toFixed(2) + ' MB';
    } else if (bytes >= 1e3) { // Kilobytes
        return (bytes / 1e3).toFixed(2) + ' KB';
    }

    return '0 MB'; // Bytes
};