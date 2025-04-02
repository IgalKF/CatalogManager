import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import CSS from 'csstype';
import { GalleryItemInfo } from '../../models/GalleryItem';
import GalleryItemDescription from './gallery-item-description/gallery-item-description';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { deleteItem, updateSingleItem, url, changeImage } from '../../services/catalog-service';
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

type ItemUploaderProps = {
    selectedFile?: File
    pageId?: any;
    refreshItems?: () => Promise<void>;
}

interface DragItem {
    index: number
    id: string
    type: string
}


interface ImageState {
    imgSrc: string;
}

const ItemTypes = {
    CARD: 'card'
}

const GalleryItem: FunctionComponent<GalleryItemProps> = ({ dragEnter, id, subPage, initialSubPage, setInitialSubPage, item, items, index, moveItem, removeItemFromGrid, willPrint, refreshItems, setItems }) => {

    const ref = useRef<HTMLDivElement>(null);
    const subPagedItemIndex = index + 20 * subPage;
    const [draggable, setDraggable] = useState(true);
    const [file, setFile] = useState<ItemUploaderProps>({ selectedFile: undefined });
    const [imageSrc, setImageSrc] = useState<number>(0);

    if (item == items[0]) {
        //console.log(`${url}Media/${item.imageId}.${item.imageExt}`);
    }

    const [handlerId, drop] = useDrop<DragItem>({
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

            console.log({subPage: subPage, drag: dragIndex,initialSubPage: initialSubPage, hover: hoverIndex})

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
        fontFamily: 'AlphaRegular'
    };

    const imageStyle: CSS.Properties = {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
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

    const changingInputStyle: CSS.Properties = {
        position: 'absolute',
        right: '0px',
        margin: '40px 5px',
        opacity: 0,
        border: 'none',
        fontSize: '17.5px',
        backgroundColor: 'red',
        color: 'blue',
        paddingLeft: '5px',
        textAlign: 'left',
        lineHeight: '10px',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        fontWeight: 'bolder',
        zIndex: 20,
    };

    const changingButtonStyle: CSS.Properties = {
        position: 'absolute',
        right: '0px',
        margin: '40px 5px',
        border: 'none',
        fontSize: '17.5px',
        backgroundColor: 'darkcyan',
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
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
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
                    newItems[subPagedItemIndex] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case (null):
                    updateSingleItem({ ...item, stock: 'out' });
                    newItems[subPagedItemIndex] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case (''):
                    updateSingleItem({ ...item, stock: 'out' });
                    newItems[subPagedItemIndex] = { ...item, stock: 'out' };
                    setItems(newItems);
                    break;
                case 'out':
                    updateSingleItem({ ...item, stock: 'temp' });
                    newItems[subPagedItemIndex] = { ...item, stock: 'temp' };
                    setItems(newItems);
                    break;
                case 'temp':
                    updateSingleItem({ ...item, stock: 'soon' });
                    newItems[subPagedItemIndex] = { ...item, stock: 'soon' };
                    setItems(newItems);
                    break;
                case 'soon':
                    updateSingleItem({ ...item, stock: 'back' });
                    newItems[subPagedItemIndex] = { ...item, stock: 'back' };
                    setItems(newItems);
                    break;
                case 'back':
                    updateSingleItem({ ...item, stock: '' });
                    newItems[subPagedItemIndex] = { ...item, stock: '' };
                    setItems(newItems);
                    break;
            }
        }
    }

    const removeItem = (name: string) => {
        if (window.confirm(`למחוק את ${name}?`)) {
            deleteItem(item.imageId);
            removeItemFromGrid(subPagedItemIndex);
        }
    }

    const changeItemImage = (event: any) => {
        setFile({ selectedFile: event.target.files[0] });
    };

    useEffect(() => {
        if (!dragEnter)
            drag(drop(ref));
    }, [dragEnter])

    useEffect(() => {
        const uploadFile = async () => {
            if (file.selectedFile && refreshItems) {
                const formData = new FormData();

                const fileExt = file.selectedFile.name.slice((file.selectedFile.name.lastIndexOf(".") - 1 >>> 0) + 2);
                formData.append(
                    "file",
                    file.selectedFile,
                    `${item.imageId}.${fileExt}`
                );
                changeImage(formData, item.imageId);
                setImageSrc(imageSrc + 1);
                refreshItems();

                setFile({});
            }
        }
        uploadFile();
    }, [file]);

    setTimeout(() => {
        if(imageSrc > 0) setImageSrc(0);
    }, 1000);

    return (
        <div style={cardStyle} data-handler-id={handlerId} ref={ref}>
            <div style={imageWrapperStyle}>
                <img style={imageStyle} className={`${imageSrc}`} onDoubleClick={changeStock} src={`${url}Media/${item.imageId}.${item.imageExt}${willPrint? '' :'?' + performance.now()}`}/>
                {willPrint ? null : <button style={deleteButtonStyle} onClick={() => removeItem(`${item.title} ${item.subTitle}`)}>×</button>}
                {willPrint ? null : <button style={changingButtonStyle}>~</button>}
                {willPrint ? null : <input style={changingInputStyle} accept="image/*" id="photo" name="photo" type="file" multiple={false} onChange={changeItemImage} />}
                {item.stock ? <img style={stockStyle} onDoubleClick={changeStock} src={`${item.stock}.png`} /> : null}
            </div>
            <div style={{ zIndex: 11, position: 'relative' }}>
                <GalleryItemDescription willPrint={willPrint} setDraggable={setDraggable} setItems={setItems} items={items} item={item} index={subPagedItemIndex} />
            </div>
            <div role="Handle" />
        </div >);
}

export default GalleryItem;