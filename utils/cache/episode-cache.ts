import {getEpisodes} from "@/utils/database/episode/get-episodes";

export interface ProgressData {
    position: number;
    duration: number;
}

// Define the cache structure
type Cache = Record<string, ProgressData>;

// Initialize cache object
let cache: Cache = {};

// Function to initialize the cache with data from the database
export const initializeCache = async (): Promise<void> => {
    const allEpisodes = await getEpisodes();
    allEpisodes.forEach(episode => {
        cache[episode.description] = {
            position: episode.position,
            duration: episode.duration
        };
    });
};

// Function to get an episode from the cache
export const getEpisode = (description: string): ProgressData | undefined => {
    // console.log('Fetching', cache[description])
    return cache[description];
};

// Function to update or add an episode to the cache
export const updateEpisode = (description: string, progress: ProgressData): void => {
    cache[description] = progress;
    // console.log('Updating', cache[description])
};

// Function to clear the cache, useful in scenarios like user logout
export const clearCache = (): void => {
    cache = {};
};
