import React, { ChangeEvent, CSSProperties, FC, useState } from 'react'
import { Page } from '../../../models/Page';
import { updatePageTitle } from '../../../services/catalog-service';
import { GalleryPageProps } from '../gallery-page';

export interface GalleryPageTitleProps {
    title: string;
    bgColor: string;
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<Page[]>>
    index: number;
}

const GalleryPageTitle: FC<GalleryPageTitleProps> = ({ title, bgColor, pages, setPages, index }) => {

    const [isInput, setIsInput] = useState(false)

    const titleStyle: CSSProperties = {
        padding: '10px 20px 5px 0',
        width: '70%',
        fontSize: '2rem',
        fontFamily: 'AlphaRegular',
        boxShadow: '20px 4px 10px 0px rgba(0, 0, 0, 0.4)',
        color: 'white',
        fontWeight: 'bolder',
        textAlign: 'right',
        backgroundColor: bgColor ? bgColor : '#49C5E0',
        display: 'flex',
    };

    const titleInputStyle: CSSProperties = {
        height: '100%',
        fontSize: '20px',
        fontFamily: 'AlphaRegular',
        direction: 'rtl',
    }

    const logoStyle: CSSProperties = {
        float: 'left',
        backgroundColor: 'black',
        position: 'relative',
        width: '150px',
        height: '50px',
    };

    const imageStyle: CSSProperties = {
        width: '100%',
        paddingTop: '13px',
        boxShadow: '-5px 10px 10px 10px rgba(0, 0, 0, 0.4)',
    };

    const setTitle = (event: ChangeEvent<HTMLInputElement>) => {
        const newPAges = [...pages];
        const page = newPAges.find(p => p.pageIndex === index);
        if (page) {
            page.pageTitle = event.target.value;
            setPages(newPAges);
            updatePageTitle(event.target.value, index);
        }
    }

    const endInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            setIsInput(false);
        }
    }
    return (
        <div>
            <div style={logoStyle}>
                <img style={imageStyle} src='titlelogo.png' />
            </div>
            <div style={titleStyle} onDoubleClick={() => setIsInput(!isInput)}>
                {isInput ? <input style={titleInputStyle} type='text' onKeyUp={endInput} onChange={setTitle} value={title} /> : title}
            </div>
        </div>
    )
}

export default GalleryPageTitle;