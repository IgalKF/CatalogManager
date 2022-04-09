import { CSSProperties, FC, useCallback } from "react";
import { DndProvider, DropTargetMonitor, useDrop } from "react-dnd";
import update from 'immutability-helper';
import { PageCard } from "./page-card/page-card";
import { Page } from "../../models/Page";
import './page-sorter.css'
import { HTML5Backend } from "react-dnd-html5-backend";
import { updateAllPages } from "../../services/catalog-service";

export interface PageSorterProperties {
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<Page[]>>;
}

const ItemTypes = {
    CARD: 'card'
}

export const PageSorter: FC<PageSorterProperties> = ({pages, setPages}) => {

    const contentStyle: CSSProperties = {
        position: 'fixed',
        top: 100,
        right: 140,
        direction: 'rtl',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
        cursor: 'default',
        zIndex: 100,
        overflow: 'scroll',
        maxHeight: '80%',
    }

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = pages[dragIndex];
        const sortedPages = update(pages, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        }).map((p,i) => {
            p.pageIndex = i + 1;
            p.items.map(item => {
                item.pageId = i + 1;
                return item;
            });
            return p;
        });

        setPages(sortedPages);

        updateAllPages(sortedPages);
    }, [pages]);

    return (
        <DndProvider backend={HTML5Backend}>
        <div style={contentStyle}>
            {pages.map((p, i) => <PageCard page={p} key={i} index={i} moveCard={moveCard} />)}
        </div>
        </DndProvider>
    );
}