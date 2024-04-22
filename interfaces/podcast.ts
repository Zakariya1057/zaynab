import {Episode} from "@/interfaces/episode";

export interface Podcast {
    id: string;
    name: string;
    image: string;
    description: string;
    subTitle: string;
    author?: string;
    episodes: Episode[];
}