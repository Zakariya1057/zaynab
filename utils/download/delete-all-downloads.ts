import {getAllDownloads} from "@/utils/database/download/get-all-downloads";
import {deleteDownloads} from "@/utils/download/delete-downloads";

export const deleteAllDownloads = async () => {
    const downloads = await getAllDownloads()
    deleteDownloads(downloads)
}