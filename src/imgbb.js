import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const IMGBB_URL = "https://api.imgbb.com/1/upload";

export async function uploadToImgBB(base64OrUrl, name = undefined, expiration = undefined) {
    const key = process.env.IMGBB_API_KEY;
    if (!key) throw new Error("IMGBB_API_KEY missing");

    const form = new FormData();
    form.append("key", key);
    form.append("image", base64OrUrl);
    if (name) form.append("name", name);
    if (expiration) form.append("expiration", String(expiration));

    const { data } = await axios.post(IMGBB_URL, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    if (!data?.success) {
        const msg = data?.status ? `ImgBB error: ${data.status}` : "ImgBB upload failed";
        throw new Error(msg);
    }

    // returns { url, display_url, delete_url, ... }
    return data.data;
}
