import React, { useState, useEffect } from "react";
import { Button, Text } from "tamagui";
import { database } from "@/utils/database/setup";
import { DownloadModel } from "@/utils/database/models/download-model";
import { formatBytes } from "@/utils/format/format-bytes";

import SettingsSection from "@/components/Settings/Section";
import SettingsInfo from "@/components/Settings/Info/Info";
import { deleteAllDownloads } from "@/utils/download/delete-all-downloads";

const Storage = () => {
    const [totalSize, setTotalSize] = useState(0);
    const [loading, setLoading] = useState(true);

    // Effect to fetch and calculate total download size on component mount
    useEffect(() => {
        const calculateTotalSize = async () => {
            setLoading(true);
            try {
                // Fetch all downloads once instead of subscribing to changes
                const downloads = await database.collections.get<DownloadModel>('downloads').query().fetch();
                const total = downloads.reduce((acc, curr) => acc + curr.totalBytesWritten, 0);
                setTotalSize(total);
            } catch (error) {
                console.error('Error calculating total size:', error);
            } finally {
                setLoading(false);
            }
        };

        calculateTotalSize();

        // Optionally, subscribe to changes with a lighter method if needed
        // For example, a basic event listener that triggers recalculation
        const unsubscribe = database.collections.get('downloads').query().observeWithColumns(['totalBytesWritten'])
            .subscribe(() => {
                calculateTotalSize(); // Recalculate on change
            });

        // Cleanup subscription on unmount
        return () => unsubscribe.unsubscribe();
    }, []);

    const handleDelete = async () => {
        await deleteAllDownloads();
    };

    return (
        <SettingsSection title="Storage">
            <SettingsInfo label="Total Downloads Size" value={formatBytes(totalSize)} />
            <Button onPress={handleDelete} fontSize={'$4'}>Delete Downloads</Button>
        </SettingsSection>
    );
}

export default Storage;
