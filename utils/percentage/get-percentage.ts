export const getPercentage = (position: number|undefined, duration: number|undefined) => {
    if (!duration || duration === 0) return null; // Prevent division by zero and handle undefined/null
    return (position || 0) / duration; // Provide a default value for position if undefined/null
};