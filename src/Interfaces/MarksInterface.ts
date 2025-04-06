export interface Mark {
    name: string;
    position: [number, number];
    type_group: string;
    ray: number;
}
export interface MarkDB {
    id: string;
    name: string;
    position_x: number;
    position_y: number;
    type_group: number;
    ray: number;
    image: Blob;
}
export interface Image {
    id: number;
    image: Blob;
}
export interface CreatMark {
    SessionID: string;
    Mark: Mark;
    img: string;
}
export interface DeleteMark {
    cook: string;
    MarkId: string;
}
export interface Getimage {
    Id: number;
}