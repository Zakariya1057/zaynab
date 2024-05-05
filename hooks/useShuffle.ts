// Custom hook to manage shuffle functionality
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {useEffect, useState} from "react";
import {shuffleTracks} from "@/utils/shuffle/shuffle-tracks";
import {sortTracks} from "@/utils/shuffle/sort-tracks";
import {storeShuffleStatus} from "@/utils/shuffle/store-shuffle-status";

export const useShuffle = () => {
    const [shuffleOn, setShuffleOn] = useState(false);

    useEffect(() => {
        fetchShuffleStatus().then( (status) => {
            setShuffleOn(status);
        })
    }, []);

    const toggleShuffle = async () => {
        const newShuffleStatus = !shuffleOn;

        if (newShuffleStatus) {
            await shuffleTracks();
        } else {
            await sortTracks();
        }

        storeShuffleStatus(newShuffleStatus);
        setShuffleOn(newShuffleStatus);
    };

    return { shuffleOn, toggleShuffle }
}

export default useShuffle;