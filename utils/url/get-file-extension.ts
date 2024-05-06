export const getFileExtension = (url: string): string => {
    const matches = /\.(\w+)$/.exec(url);
    return matches ? matches[1] : 'mp3';  // Default to 'mp3' if no extension found
};
