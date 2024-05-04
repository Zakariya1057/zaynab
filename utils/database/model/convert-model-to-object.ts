import { Model } from "@nozbe/watermelondb";

export const convertModelToObject = <T extends Model>(model: Model): T => {
    const json: any = {};
    const raw = model["_raw"];

    Object.keys(raw).forEach((key) => {
        if (!key.startsWith("_")) {
            json[key] = raw[key];
        }
    });

    return json;
};
