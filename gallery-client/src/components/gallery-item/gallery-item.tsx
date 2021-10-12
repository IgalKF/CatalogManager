import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import CSS from 'csstype';
import { GalleryItemInfo } from '../../models/GalleryItem';
import ItemUploader from '../item-uploader/item-uploader';
import GalleryItemDescription from './gallery-item-description/gallery-item-description'
import { DndProvider, DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { deleteItem, updateSingleItem, url } from '../../services/catalog-service';
import { readBuilderProgram } from 'typescript';
import { strictEqual } from 'assert';

export interface GalleryItemProps {
    item: GalleryItemInfo;
    items: GalleryItemInfo[];
    id?: number;
    index: number;
    subPage: number;
    initialSubPage: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    removeItemFromGrid: (itemIndex: number) => void;
    willPrint: boolean;
    dragEnter: boolean;
    refreshItems?: () => Promise<void>;
    setItems: React.Dispatch<React.SetStateAction<GalleryItemInfo[]>>;
    setInitialSubPage: React.Dispatch<React.SetStateAction<number>>;
}

interface DragItem {
    index: number
    id: string
    type: string
}

const ItemTypes = {
    CARD: 'card'
}

const GalleryItem: FunctionComponent<GalleryItemProps> = ({ dragEnter, id, subPage, initialSubPage, setInitialSubPage, item, items, index, moveItem, removeItemFromGrid, willPrint, refreshItems, setItems }) => {

    const ref = useRef<HTMLDivElement>(null);

    const [draggable, setDraggable] = useState(true);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(dragItem: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = initialSubPage * 20 + dragItem.index
            const hoverIndex = subPage * 20 + index

            if (hoverIndex > items.length || hoverIndex < 0 || dragIndex > items.length || dragIndex < 0) {
                return;
            }

            if (dragIndex === hoverIndex) {
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            moveItem(dragIndex, hoverIndex)
            setInitialSubPage(subPage);
            dragItem.index = hoverIndex - subPage * 20;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            setInitialSubPage(subPage);
            return { id, index }
        },
        canDrag: draggable,
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        })
    }, [draggable]);

    const cardStyle: CSS.Properties = {
        color: 'black',
        fontSize: '14px',
        opacity: isDragging ? 0.5 : 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'white',
        fontFamily: 'AlphaRegular',

    };

    const imageStyle: CSS.Properties = {
        width: '95%',
        height: 'auto',
    };

    const descriptionStyle: CSS.Properties = {
        color: 'black',
    };

    const deleteButtonStyle: CSS.Properties = {
        position: 'absolute',
        right: '0px',
        margin: '5px',
        border: 'none',
        fontSize: '17.5px',
        backgroundColor: 'red',
        color: 'white',
        paddingLeft: '5px',
        textAlign: 'left',
        lineHeight: '10px',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        fontWeight: 'bolder',
        zIndex: 11,
    };

    const imageWrapperStyle: CSS.Properties = {
        position: 'relative',
    };

    const stockStyle: CSS.Properties = {
        position: 'absolute',
        width: item.stock == 'soon' ? '100%' : '80%',
        zIndex: 10,
        left: '-5px',
        top: '-5px',
    };


    const changeStock = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const newItems = [...items];
        if (refreshItems) {
            switch (item.stock) {
                case (undefined):
                    updateSingleItem({ ...item, stock: 'out' });
                    newItems[item.index] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case (null):
                    updateSingleItem({ ...item, stock: 'out' });
                    newItems[item.index] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case (''):
                    updateSingleItem({ ...item, stock: 'out' });
                    newItems[item.index] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case 'out':
                    updateSingleItem({ ...item, stock: 'soon' });
                    newItems[item.index] = { ...item, stock: 'soon' };
                    setItems(newItems);
                    break;
                case 'soon':
                    updateSingleItem({ ...item, stock: 'back' });
                    newItems[item.index] = { ...item, stock: 'back' };
                    setItems(newItems);
                    break;
                case 'back':
                    updateSingleItem({ ...item, stock: '' });
                    newItems[item.index] = { ...item, stock: '' };
                    setItems(newItems);
                    break;
            }
        }
    }

    const removeItem = (name: string) => {
        if (window.confirm(`למחוק את ${name}?`)) {
            deleteItem(item.imageId);
            removeItemFromGrid(index);
        }
    }

    useEffect(() => {
        if(!dragEnter)
            drag(drop(ref));
    }, [dragEnter])

    return (
        <div style={cardStyle} data-handler-id={handlerId} ref={ref}>
            <div style={imageWrapperStyle}>
                {willPrint ? null : <button style={deleteButtonStyle} onClick={() => removeItem(`${item.title} ${item.subTitle}`)}>×</button>}
                <img style={imageStyle} onDoubleClick={changeStock} src={`${url}Media/${item.imageId}.${item.imageExt}`} />
                {item.stock ? <img style={stockStyle} onDoubleClick={changeStock} src={`${item.stock}.png`} /> : null}
            </div>
            <div style={{ zIndex: 11, position: 'relative' }}>
                <GalleryItemDescription setDraggable={setDraggable} setItems={setItems} items={items} item={item} index={item.index} />
            </div>
            <div role="Handle" ref={drag} />
        </div >);
}

export default GalleryItem;