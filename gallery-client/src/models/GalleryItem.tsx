export interface GalleryItemInfo {
    imageId: string;
    pageId: any;
    index: number;
    imageExt: string;
    title: string;
    subTitle: string;
    code: string;
    barCode: string;
    stock: 'out' | 'soon' | 'back' | '';
}