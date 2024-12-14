export interface Mark {
    id?: string;
    name: string;
    position_x: number;
    position_y: number;
    type_group: string;
    group_name: string;
}
export interface CreatMark {
    SessionID: string;
    Mark:Mark
}
export interface DeleteMark {
    SessionID: string;
    MarkId: string;
}