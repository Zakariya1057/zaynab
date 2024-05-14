import {sendEmail} from "@/utils/linking/mail/send-email";

export const handleSubmitFeedback = () => {
    sendEmail(
        "zakaria2011@live.no",
        "Zaynab - Submit Feedback",
        "Hi,\n\nI have some feedback about your app:\n"
    );
}
