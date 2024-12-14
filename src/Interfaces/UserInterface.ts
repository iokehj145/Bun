export interface User {
    name: string;
    password: string;
    email?: string;
    show?: boolean;
    id?: string;
}
export interface GetGoogle {
    user: User;
    success: boolean;
}
export type GoogleUser = GetGoogle | null;
export interface Google {
    credential: string;
}

export type VerifyRecord2 = {
    id: string;
    user_name: string;
    user_email: string;
    user_password: string;
};
export type Checker =
number | null | undefined;