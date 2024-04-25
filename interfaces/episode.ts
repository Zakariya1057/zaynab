import {ImageSourcePropType} from "react-native";

export interface Episode {
    id: string;
    number: number;
    url: string;
    description: string;
    duration?: number;
    position?: number;
    downloaded?: boolean;
    image?: ImageSourcePropType;
    background?: ImageSourcePropType;
    author?: string
}

