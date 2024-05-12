import {sendEmail} from "@/utils/linking/mail/send-email";

export const handleReportBugs = () => {
    sendEmail(
        "zakaria2011@live.no",
        "Report Bug",
        "Hi,\n\nI encountered the following bug in your app:\n"
    );
}