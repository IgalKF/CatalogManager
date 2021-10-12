import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";
import { CSSProperties, FC, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Page } from "../../../models/Page";

export interface PageSorterProperties {
    page: Page;
    moveCard: (dragIndex: any, hoverIndex: any) => void;
    index: number;
}

const ItemTypes = {
    CARD: 'card'
}

export const PageCard: FC<PageSorterProperties> = ({ page, moveCard, index }) => {

    const sortBlockStyle: CSSProperties = {
        backgroundColor: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
    }

    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            if (clientOffset) {
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                moveCard(dragIndex, hoverIndex);
                item.index = hoverIndex;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id: index, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <div data-handler-id={handlerId} ref={ref} style={sortBlockStyle}>{page.initialIndex}. {page.pageTitle}
            <div role="Handle" ref={drag} />
        </div>
    );
}