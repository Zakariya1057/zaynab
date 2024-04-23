import { Podcast } from "@/interfaces/podcast";
import { Podcasts } from "@/utils/data/podcasts";

// Use keyof typeof to ensure podcastId is a valid key from the Podcasts record.
export const getPodcastById = (podcastId: keyof typeof Podcasts): Podcast => {
    // Since podcastId is guaranteed to be a valid key, TypeScript will not throw a compile-time error.
    // However, adding runtime validation can still be beneficial depending on your application structure.
    const podcast = Podcasts[podcastId];
    if (!podcast) {
        throw new Error(`Podcast with ID ${podcastId} not found.`);
    }
    return podcast;
}
