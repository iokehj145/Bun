export interface Mark {
    name: string;
    position_x: number;
    position_y: number;
    type_group: string;
    group_name: string;
};
export interface CreatMark {
    SessionID: string;
    Mark:Mark
}

export interface User {
    name: string;
    password: string;
    email?: string;
    show?: boolean;
    id?: string;
};
export interface GetGoogle {
    user: User;
    success: boolean;
}
export interface Google {
    credential: string;
}

 export type VerifyRecord2 = {
    id: string;
    user_name: string;
    user_email: string;
    user_password: string;
};

export type GoogleUser = GetGoogle | null;
export type Checker = 
number | null | undefined;