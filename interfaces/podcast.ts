import {Episode} from "@/interfaces/episode";
import {ImageSourcePropType} from "react-native";

export interface Podcast {
    id: string;
    name: string;
    image: ImageSourcePropType;
    background: ImageSourcePropType;
    description: string;
    subTitle: string;
    author?: string;
    episodes: Record<string, Episode>;
}