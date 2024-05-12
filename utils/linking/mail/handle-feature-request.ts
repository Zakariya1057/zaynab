import { sendEmail } from "@/utils/linking/mail/send-email";

export const handleFeatureRequest = () => {
    const recipientEmail = "zakaria2011@live.no"; // The email address to receive feature requests
    const emailSubject = "Feature Request for Your App"; // Subject line for the feature request email
    const emailBody = "Hi,\n\nI have an idea for your app that could make it even better! I would love to see this feature added:\n\n[Describe the feature here]\n\nLooking forward to your thoughts!\n"; // Body template for the feature request email

    sendEmail(
        recipientEmail,
        emailSubject,
        emailBody
    );
}
