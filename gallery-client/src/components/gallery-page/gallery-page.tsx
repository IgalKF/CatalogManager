import fetchCatalog, { fetchPageItems, insertNewCatalogItem, updateAllPages, uploadImage } from '../../services/catalog-service';
import ItemUploader from '../../components/item-uploader/item-uploader';
import GalleryItem from '../../components/gallery-item/gallery-item';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { GalleryItemInfo } from '../../models/GalleryItem';
import GalleryPageGrid from './gallery-page-grid/GalleryPageGrid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Page } from '../../models/Page';
import { CSSProperties } from 'react';
import GalleryPageTitle from './gallery-page-title/gallery-page-title';
import { FileDrop } from 'react-file-drop';
import { v4 } from 'uuid';
import Dropzone from 'react-dropzone';

export interface GalleryPageProps {
    data: Page;
    willPrint: boolean;
    bgColors: any;
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<Page[]>>
}

const GalleryPage: FC<GalleryPageProps> = ({ data, willPrint, bgColors, pages, setPages }) => {

    const [dragEnter, setdragEnter] = useState(false);
    const [initialSubPage, setInitialSubPage] = useState(-1);
    const [items, setItems] = useState<Array<GalleryItemInfo>>(data.items);
    const [splittedPages, setSplittedPages] = useState<Page[]>(JSON.parse(JSON.stringify(pages)));

    const pageDeleteButtonStyle: CSSProperties = {
        position: 'absolute',
        right: '-50px',
        margin: '25px 0 0 0',
        border: 'none',
        color: 'white',
        backgroundColor: 'red',
        fontSize: '20px',
        borderRadius: '50%',
        height: '30px',
        width: '30px',
        zIndex: 11,
    }

    const pageIndexStyle: CSSProperties = {
        fontSize: '20px',
        position: 'absolute',
        top: 26,
        right: -85,
    }

    const pageStyle: CSSProperties = {
        position: 'relative',
        direction: 'rtl',
        textAlign: 'center',
        WebkitPrintColorAdjust: 'exact',
        pageBreakAfter: 'always',
        background: `linear-gradient(-45deg, ${bgColors.lower} 0%, ${bgColors.higher} 100%)`,
        display: 'grid',
        padding: '15px 0 0 0',
        height: '1107px',
        gridTemplateRows: 'min-content auto 10px',
        rowGap: '0px',
        width: willPrint ? '100%' : '210mm',

        // File drag style:
        border: dragEnter ? '10px dashed green' : 'none',
    }

    const uploadFile = async (files: File[]) => {
        if (files) {
            const file = files[0];
            const guid = v4();

            if (file) {
                const formData = new FormData();

                const fileExt = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
                formData.append(
                    "file",
                    file,
                    `${guid}.${fileExt}`
                );

                uploadImage(formData);

                await insertNewCatalogItem({ subTitle: '-', barCode: '-', code: '-', imageId: guid, imageExt: fileExt, pageId: data.pageIndex } as GalleryItemInfo)

                if (data.pageIndex) {
                    const response = await fetchPageItems(data.pageIndex);

                    setItems(response.data);
                }
            }
        }
    }

    const deletePage = async () => {
        if (window.confirm(`האם למחוק את ${data.pageTitle} ${data.pageIndex}`)) {
            const newPages = [...pages];

            if (data.pageIndex) {
                newPages.splice(data.pageIndex - 1, 1);
                const pagesToUpdate = newPages.map((p, i) => {
                    p.pageIndex = i + 1;
                    return p
                });

                setPages(pagesToUpdate);

                await updateAllPages(pagesToUpdate);
            }
        }
    }

    useEffect(() => {
        if (items.length > 20) {
            const newSplittedPages = [];
            let numberOfSplits = Math.floor(items.length / 20 + 1);
            let i = 0;
            while (i < numberOfSplits) {
                newSplittedPages.push({
                    ...data, items: items.slice(i * 20, (i + 1) * 20)
                });
                i++;
            }
            setSplittedPages(newSplittedPages);
        }
        else {    
            setSplittedPages([{...data, items: items}]);
        }
    }, [pages, items]);

    return (
        <div>
            <Dropzone
                onDragOver={() => setdragEnter(true)}
                onDragEnter={() => {setdragEnter(true)}}
                onDropAccepted={() => setdragEnter(false)}
                onDropRejected={() => setdragEnter(false)}
                onDragLeave={() => setdragEnter(false)}
                onDrop={acceptedFiles => uploadFile(acceptedFiles)}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        {splittedPages.map((p, i) =>
                            <div key={i} className='page' style={pageStyle}>
                                {willPrint ? null : <div style={pageIndexStyle}>{data.initialIndex}</div>}
                                {willPrint ? null : <button onClick={deletePage} style={pageDeleteButtonStyle}>×</button>}
                                {dragEnter ? <h1>הוסף תמונה חדשה!</h1> : null}
                                {dragEnter ? null : data.pageTitle !== undefined && data.pageIndex ?
                                    <div {...getInputProps}>
                                        <GalleryPageTitle index={data.pageIndex} pages={pages} setPages={setPages} title={data.pageTitle} bgColor={bgColors.title} />
                                    </div>
                                    : null}
                                {items && data.pageIndex ?
                                    <GalleryPageGrid dragEnter={dragEnter} subPageIndex={i} setPages={setPages} pages={pages} initialSubPage={initialSubPage} setInitialSubPage={setInitialSubPage} willPrint={willPrint} listItems={p.items} items={items} setItems={setItems} pageIndex={data.pageIndex} />
                                    : null}
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default GalleryPage;
