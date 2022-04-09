import fetchCatalog, { fetchPageItems, insertNewCatalogItem, uploadImage } from '../../services/catalog-service';
import ItemUploader from '../../components/item-uploader/item-uploader';
import GalleryItem from '../../components/gallery-item/gallery-item';
import { FC, useEffect, useState } from 'react';
import { GalleryItemInfo } from '../../models/GalleryItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Page } from '../../models/Page';
import { CSSProperties } from 'react';
import { FileDrop } from 'react-file-drop';
import { v4 } from 'uuid';
import Dropzone from 'react-dropzone';
import { BgColors } from '../../models/Properties';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export interface FrontPageProps {
    willPrint: boolean;
    bgColors: BgColors;
    lastPage: boolean;
}

const FrontPage: FC<FrontPageProps> = ({ willPrint, bgColors, lastPage }) => {

    const pageStyle: CSSProperties = {
        direction: 'rtl',
        WebkitPrintColorAdjust: 'exact',
        pageBreakAfter: 'always',
        background: `linear-gradient(-45deg, ${bgColors.lower} 0%, ${bgColors.higher} 100%)`,
        display: 'grid',
        padding: '15px 0 0 0',
        height: '1106px',
        gridTemplateRows: '1fr 20% 1fr',
        gridTemplateColumns: '30% 1% 1fr',
        rowGap: '0px',
        width: willPrint ? '100%' : '210mm',
        fontFamily: 'AlphaBold',
        textAlign: 'right',
        fontSize: '50px',
        lineHeight: '1.5',
    }

    const titleBlockStyle: CSSProperties = {
        boxShadow: '10px 10px 10px rgba(0,0,0,0.4)',
        backgroundColor: bgColors.title,
        float: 'right',

    }
    
    const frontPageLogoWrapper: CSSProperties = {
        boxShadow: '10px 10px 10px rgba(0,0,0,0.4)',
        background: 'linear-gradient(90deg, black 50%, rgb(20,20,20) 100%)',
        height: '100%',
        float: 'left',
    }

    const imageStyle: CSSProperties = {
        margin: '15% 14% 0 0',
    }

    return (
        <div className='page' style={pageStyle}>
            <div></div>
            <div></div>
            <div></div>
            <div style={titleBlockStyle}></div>
            <div></div>
            <div style={frontPageLogoWrapper}>
                <img style={imageStyle} src='titlelogo.png'/>
            </div>
            <div></div>
            <div></div>
            {lastPage ? <div style={{fontSize: '30px', margin: '20px 40px 0 0'}}>אליהו צבאן חברה בע"מ<br/>דרך יפו 30 תל-אביב-יפו<br/>טלפון: 03-6825051<br/><a style={{color: 'cyan'}} href='www.slider-il.com'>www.slider-il.com</a></div> : <div>קטלוג מוצרים</div>}
        </div>
    );
}

export default FrontPage;
