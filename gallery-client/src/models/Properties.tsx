export interface Properties {
    Id: number;
    bgColors: BgColors;
    askBeforeItemRemoval: boolean;
}

export interface BgColors {
    lower: string;
    higher: string;
    title: string;
}