import {ImageSourcePropType} from "react-native";

export interface Episode {
    id: string;
    number: number;

    stream: string;
    download: string;

    speaker?: string;

    description: string;
    duration?: number;
    position?: number;
    downloaded?: boolean;
    image?: ImageSourcePropType;
    remoteImage?: string;
    background?: ImageSourcePropType;
    author?: string
}

