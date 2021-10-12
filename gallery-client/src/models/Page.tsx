import { GalleryItemInfo } from "./GalleryItem";


export class Page {
   public pageId?: any;
   public pageIndex?: number;
   public initialIndex?: number;
   public pageTitle?: string;
   public items: Array<GalleryItemInfo> = [];
}
