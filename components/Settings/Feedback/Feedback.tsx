import React from 'react';
import SettingsSection from '../Section';
import SettingsButton from '@/components/Settings/Button';
import { handleSubmitFeedback } from '@/utils/linking/mail/handle-submit-feedback';
import { handleReportBugs } from '@/utils/linking/mail/handle-report-bugs';
import { handleFeatureRequest } from '@/utils/linking/mail/handle-feature-request';

export default function FeedbackSupportSettings() {
    return (
        <SettingsSection title="Feedback & Support">
            <SettingsButton title="Suggest a New Feature" onPress={handleFeatureRequest}/>
            <SettingsButton title="Give Us Your Feedback" onPress={handleSubmitFeedback}/>
            <SettingsButton title="Report a Problem" onPress={handleReportBugs}/>
        </SettingsSection>
    );
}
