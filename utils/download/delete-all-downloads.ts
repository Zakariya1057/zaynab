import {getAllDownloads} from "@/utils/database/download/get-all-downloads";
import {confirmDeleteDownloads} from "@/utils/download/confirm-delete-downloads";

export const deleteAllDownloads = async () => {
    const downloads = await getAllDownloads()
    confirmDeleteDownloads(downloads)
}