import React, { ChangeEvent, ChangeEventHandler, CSSProperties, FC, FunctionComponent, useEffect, useState, useRef } from 'react'
import { GalleryItemInfo } from '../../../models/GalleryItem';
import { updateSingleItem } from '../../../services/catalog-service';

export interface GalleryItemDescriptionProps {
    item: GalleryItemInfo,
    items: GalleryItemInfo[],
    setItems: React.Dispatch<React.SetStateAction<GalleryItemInfo[]>>;
    setDraggable: React.Dispatch<React.SetStateAction<boolean>>,
    index: number,
    willPrint: boolean,
}

const useFocus = () => {
	const htmlElRef = useRef<HTMLInputElement>(null)
	const setFocus: () => void = () => {htmlElRef.current &&  htmlElRef.current.focus()}

	return [ htmlElRef,  setFocus ] 
}

const GalleryItemDescription: FunctionComponent<GalleryItemDescriptionProps> = ({ item, setDraggable, index, items, setItems, willPrint }) => {

    const [isInputs, setIsInputs] = useState(false);
    const [inputRef, setInputFocus] = useFocus();

    const blankBlockStyle: CSSProperties = {
        height: '6px',
    }

    const contentStyle: CSSProperties = {
        fontSize: '15px',
        color: 'black',
    }
    const changeInputState = () => setIsInputs(!isInputs);

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].title = event.target.value;
        setItems(newItems);
        updateSingleItem({ ...item, title: newItems[index].title });
    }

    const handleSubTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].subTitle = event.target.value;
        setItems(newItems);
        updateSingleItem({ ...item, subTitle: newItems[index].subTitle });
    }

    const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].code = event.target.value;
        setItems(newItems);
        updateSingleItem({ ...item, code: newItems[index].code });
    }

    const handleBarCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].barCode = event.target.value;
        setItems(newItems);
        updateSingleItem({ ...item, barCode: newItems[index].barCode });
    }

    const end = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            setIsInputs(false);
        }
    }

    useEffect(() => {
        if (isInputs)
            setDraggable(false);
        else
            setDraggable(true);
    }, [isInputs]);

    return (
        <div style={contentStyle} onDoubleClick={changeInputState}>
            {isInputs && !willPrint
                ? (<div><input ref={inputRef} onKeyUp={end} type='text' value={item.title} onChange={handleTitleChange} /><br />
                    <input onKeyUp={end} type='text' value={item.subTitle} onChange={handleSubTitleChange} /><br />
                    <input onKeyUp={end} type='text' value={item.code} style={{ fontFamily: 'arial !important' }} onChange={handleCodeChange} /><br />
                    <input onKeyUp={end} type='text' value={item.barCode} style={{ fontFamily: 'arial !important' }} onChange={handleBarCodeChange} /></div>)
                : ((<div>  {item.title ? <span>{item.title}<br /></span> : <div style={blankBlockStyle}></div>}
                    {item.subTitle ? <span>{item.subTitle}<br /></span> : null}
                    <span style={{ fontFamily: 'arial' }}>{item.code}</span><br />
                    <span style={{ fontFamily: 'arial' }}>{item.barCode}</span></div>))}
        </div>
    )
}

export default GalleryItemDescription;