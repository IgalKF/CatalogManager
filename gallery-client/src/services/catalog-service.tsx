import axios from "axios";
import { GalleryItemInfo } from "../models/GalleryItem";
import { Page } from "../models/Page";
import { Properties } from "../models/Properties";

export const url = 'https://localhost/CatalogApi/';

const fetchCatalog = async () => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.get<Array<Page>>('Pages');
}

export const fetchPageItems = async (pageIndex: number) => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.get<Array<GalleryItemInfo>>(`Items/${pageIndex}`);
}

export const fetchProperties = async () => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.get<Properties>(`Properties`);
}

export const updateProperties = async (props: Properties) => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.post<Properties>(`Properties`, props);
}

export const updatePageTitle = async (title: string, index: number) => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.post<Page>(`Pages/UpdateTitle`, { pageTitle: title, pageIndex: index } as Page);
}

export const updateAllPages = async (pages: Page[]) => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });
    return await request.post<Page>(`Pages/UpdateAll`, pages);
}

export function uploadImage(formData: FormData) {
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    const request = axios.create({ baseURL: url, headers });
    request.post("Images/UploadImage", formData);
}

export async function insertNewCatalogItem(item: GalleryItemInfo) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });

    await request.put("Items", item);
}

export function createPage(page: Page) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });

    request.put("Pages", page);
}

export function updatePageItems(page: Page) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });

    request.post("Pages", page);
}

export function updateSingleItem(item: GalleryItemInfo) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });

    request.post("Items", item);
}

export function deleteItem(itemId: string) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    const request = axios.create({ baseURL: url, headers });

    request.delete(`Items/${itemId}`);
}

export default fetchCatalog;