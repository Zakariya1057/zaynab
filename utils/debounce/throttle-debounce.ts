// utils/throttleDebounce.ts
export const throttleDebounce = (func: (...args: any[]) => void, throttleWait: number, debounceWait: number) => {
    let throttleTimeout: NodeJS.Timeout | null = null;
    let debounceTimeout: NodeJS.Timeout | null = null;
    let lastArgs: any;

    return (...args: any[]) => {
        lastArgs = args;

        if (!throttleTimeout) {
            func(...lastArgs);
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;
            }, throttleWait);
        }

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            func(...lastArgs);
        }, debounceWait);
    };
};
