import {Linking} from "react-native";

export const sendEmail = (email: string, subject: string, body: string) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const url = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    Linking.openURL(url).catch(err => console.error('An error occurred trying to open the URL:', err));
}