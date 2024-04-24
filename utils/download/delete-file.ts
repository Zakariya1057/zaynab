export const downloadFile = async (url, filename) => {
    const fileUri = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob', // Important to handle the binary data correctly
        onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`${percentCompleted}% done`);
        }
    });

    // Writing the downloaded file to the local storage
    const file = new Blob([response.data], { type: 'audio/mp3' });
    await RNFS.writeFile(fileUri, file, 'base64');
    console.log(`File downloaded to: ${fileUri}`);
    return fileUri;
};
