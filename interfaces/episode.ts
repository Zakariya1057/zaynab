import {ImageSourcePropType} from "react-native";

export interface Episode {
    id: string;
    number: number;
    url: string;
    description: string;
    image?: ImageSourcePropType;
    background?: ImageSourcePropType;
    author?: string
}

