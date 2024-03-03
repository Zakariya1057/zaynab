import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: "https://4fedaec9ca86c927cfc211d2e271ad35@o4506030478262272.ingest.sentry.io/4506842003275776",
    tracesSampleRate: 1.0,
});

import 'expo-router/entry';