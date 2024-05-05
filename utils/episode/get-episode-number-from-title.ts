/**
 * Extracts the episode number from a given track title.
 * @param title The title of the track from which to extract the episode number.
 * @returns The episode number as a number if successfully parsed, or null if the extraction fails.
 */
export const getEpisodeNumberFromTitle = (title: string|undefined = ''): number => {
    // Early return for empty or undefined titles
    if (!title) return 0;

    // Attempt to split the title and parse the first segment as a number
    const episodePart = title.split('. ')[0];
    const episodeNumber = parseInt(episodePart, 10);

    // Check if the parsed number is a valid integer
    if (isNaN(episodeNumber)) {
        return 0;
    }

    return episodeNumber;
}