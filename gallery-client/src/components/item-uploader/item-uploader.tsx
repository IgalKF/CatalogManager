import axios from 'axios';
import { title } from 'process';
import React, { Component, useState, FunctionComponent, EventHandler, CSSProperties, useCallback, useEffect } from 'react';
import { v4 } from 'uuid';
import { GalleryItemInfo } from '../../models/GalleryItem';
import IFile from '../../models/IFile'
import { insertNewCatalogItem, uploadImage } from '../../services/catalog-service';

type ItemUploaderProps = {
    selectedFile?: File
    pageId?: any;
    refreshItems?: () => Promise<void>;
}

const ItemUploader: FunctionComponent<ItemUploaderProps> = ({ pageId, refreshItems }) => {

    const [file, setFile] = useState<ItemUploaderProps>({ selectedFile: undefined });

    const [guid, setGuid] = useState<string>('');

    const onFileChange = (event: any) => {
        setGuid(v4());

        setFile({ selectedFile: event.target.files[0] });
    };

    useEffect(() => {
        const uploadFile = async () => {
            if (file.selectedFile && refreshItems) {
                const formData = new FormData();
        
                const fileExt = file.selectedFile.name.slice((file.selectedFile.name.lastIndexOf(".") - 1 >>> 0) + 2);
                formData.append(
                    "file",
                    file.selectedFile,
                    `${guid}.${fileExt}`
                );
        
                uploadImage(formData);
        
                await insertNewCatalogItem({ subTitle: '-', barCode: '-', code: '-', imageId: guid, imageExt: fileExt, pageId: pageId } as GalleryItemInfo)
                refreshItems();
            }
        }
        uploadFile();
    }, [file]);

    const uploaderStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0,
        right: 0,
        zIndex: 2,
    };

    const uploadCardStyle: CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '2px solid white',
        color: 'white',
        fontSize: '100px',
        verticalAlign: 'middle',
        zIndex: 1,
        right: 0,
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={uploadCardStyle}>+</div>
            <input
                style={uploaderStyle}
                accept="image/*"
                id="photo"
                name="photo"
                type="file"
                multiple={false}
                onChange={onFileChange}
            />
        </div>);

}
export default ItemUploader;