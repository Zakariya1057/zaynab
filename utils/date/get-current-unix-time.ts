export const getCurrentUnixTime = () => {
    return Math.floor(new Date().getTime() / 1000);
}