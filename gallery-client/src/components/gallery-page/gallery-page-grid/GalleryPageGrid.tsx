import { CSSProperties, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { GalleryItemInfo } from '../../../models/GalleryItem';
import GalleryItem from '../../gallery-item/gallery-item';
import CSS from 'csstype';
import { fetchPageItems, updatePageItems } from '../../../services/catalog-service';
import update from 'immutability-helper';
import ItemUploader from '../../item-uploader/item-uploader';
import { Page } from '../../../models/Page';

export interface GalleryPageGridProps {

    items: Array<GalleryItemInfo>;
    listItems: Array<GalleryItemInfo>;
    setItems: React.Dispatch<React.SetStateAction<GalleryItemInfo[]>>;
    setPages: React.Dispatch<React.SetStateAction<Page[]>>;
    dragEnter: boolean;
    pages: Page[];
    setInitialSubPage: React.Dispatch<React.SetStateAction<number>>;
    pageIndex: number;
    subPageIndex: number;
    initialSubPage: number;
    willPrint: boolean;
}

export interface Item {
    id: number
    text: string
}

export interface ContainerState {
    cards: Item[]
}

const GalleryPageGrid: FunctionComponent<GalleryPageGridProps> = ({ dragEnter, setPages, pages ,items, subPageIndex, initialSubPage, setInitialSubPage, listItems, setItems, pageIndex, willPrint }) => {

    const gridStyle: CSSProperties = {
        direction: 'rtl',
        margin: '3% 10px 35px 10px',
        display: dragEnter ? 'none' : 'grid',
        gap: '10px 10px',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
    }

    const moveItem = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            // console.log(`dragIndex: ${dragIndex}`,`hoverIndex: ${hoverIndex}`);
            if (items) {
                const dragCard = items[dragIndex]             
                const newItems = [...items];
                newItems.splice(dragIndex, 1);
                newItems.splice(hoverIndex, 0, dragCard);
                newItems.map((item, i) => { item.index = i; return item; });
                setItems(
                    update(items, {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    }),
                    );
                updatePageItems({ items: newItems, pageIndex: pageIndex, });
            }
        },
        [items],
    )

    const removeItemFromGrid = (itemIndex: number) => {
        setItems(
            update(items, {
                $splice: [
                    [itemIndex, 1],
                ]
            })
        );
    }

    const refreshGridItems = async () => {
        if (pageIndex) {
            console.log('refresh');
            const response = await fetchPageItems(pageIndex);
            setItems(
                response.data
            );
        }
    }

    return (
        <>
            <div style={gridStyle}>
                {listItems.map((item, i) => <GalleryItem dragEnter={dragEnter} subPage={subPageIndex} initialSubPage={initialSubPage} setInitialSubPage={setInitialSubPage} willPrint={willPrint} key={i} id={i} index={i} item={item} moveItem={moveItem} setItems={setItems} items={items} removeItemFromGrid={removeItemFromGrid} refreshItems={refreshGridItems} />)}
                {listItems.length < 20 && !willPrint ? <ItemUploader pageId={pageIndex} refreshItems={refreshGridItems} /> : null}
            </div>
        </>
    );
}

export default GalleryPageGrid;
