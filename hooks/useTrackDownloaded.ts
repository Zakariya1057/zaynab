import {useState} from "react";

export const useTrackDownloaded = () => {
    const [downloaded, setDownloaded] = useState<boolean>(false)
    const [downloading, setDownloading] = useState<boolean>(false)



    return { downloaded, downloading }
}