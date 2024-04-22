import React, { useState, useCallback, useMemo } from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {DownloadIcon, FavoriteIcon, PlaylistIcon, ShareIcon, SpeedIcon} from "../../Old/SVG";
import {Theme} from "../../../constants";
import { createMediaAction } from "../../UI/MediaAction/MediaAction";
import {SVGStyling} from "../../../interfaces/SVGStyling";
import {SpeedIconStyle} from "../../Old/SVG/speed-icon";

const CustomMediaAction = createMediaAction<SVGStyling>();
const SpeedAction = createMediaAction<SpeedIconStyle>();

const speeds = [1.0, 1.25, 1.50, 1.75, 2.0, 0.5, 0.75];

interface Props {
    speed: number
    setSpeed: (speed: number) => void
}

export default function MediaActionComponent({ speed, setSpeed }: Props) {
    const initialSpeedIndex = speeds.indexOf(speed) !== -1 ? speeds.indexOf(speed) : 0;
    const [currentSpeedIndex, setCurrentSpeedIndex] = useState(initialSpeedIndex);

    const styling: SVGStyling = useMemo(() => ({
        dimensions: {
            width: 50,
            height: 30,
        },
        fillColor: Theme.colors.lightGray,
    }), []);

    const toggleSpeed = useCallback(() => {
        // Compute the new index and update both the local state and the parent component state
        const newIndex = (currentSpeedIndex + 1) % speeds.length;
        setCurrentSpeedIndex(newIndex);
        // Use newIndex to refer to the updated state for setting speed
        setSpeed(speeds[newIndex]);
    }, [currentSpeedIndex]); // Make sure to include currentSpeedIndex in the dependencies array


    return (
        <View style={styles.container}>
            <CustomMediaAction IconComponent={ShareIcon} svgStyling={styling} label="Partager" />
            <CustomMediaAction IconComponent={FavoriteIcon} svgStyling={styling} label="Favori" />
            <CustomMediaAction IconComponent={PlaylistIcon} svgStyling={styling} label="Playlist" />
            <TouchableOpacity onPress={toggleSpeed}>
                <SpeedAction IconComponent={SpeedIcon} svgStyling={{ ...styling, speedText: 'X' + speeds[currentSpeedIndex] }} label="Vitesse" />
            </TouchableOpacity>
            <CustomMediaAction IconComponent={DownloadIcon} svgStyling={styling} label="Téléchargés" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Theme.spacing.small,
    },
});
