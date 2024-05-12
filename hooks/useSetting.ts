import { useState, useEffect } from 'react';
import {SettingKey} from "@/interfaces/setting-key";
import {setSetting as setDbSetting } from "@/utils/database/setting/set-setting";
import {getSetting, updateSetting} from "@/utils/cache/setting-cache";

// Define a generic type for the hook that ensures the values are appropriate for the settings being handled.
function useSetting(key: SettingKey, defaultValue: boolean): [boolean, (newValue: boolean) => void] {
    const [value, setValue] = useState<boolean>(defaultValue);

    useEffect(() => {
        async function fetchSetting() {
            const cachedValue = getSetting(key)
            setValue(cachedValue ?? false);
        }

        fetchSetting();
    }, [key]);

    const handleValueChange = async (newValue: boolean) => {
        console.log('Handling Value Changes')
        setValue(newValue);
        updateSetting(key, newValue)
        setDbSetting(key, newValue);
    };

    return [value, handleValueChange];
}

export default useSetting;
