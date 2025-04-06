export interface Admin {
    id: string
}
export interface SearchBody {
    cook: string;
    sel: string;
    serch: string | undefined;
}
export interface DeleteUser {
    cook: string;
    id: string;
}

export interface UserRecord {  
    id: string;  
    name: string | null;  
    password: string | null;  
    email: string | null;  
    show: boolean;  
} 
export interface OfferRecord {  
    id: number;  
    name: string;  
    position_x: number;  
    position_y: number;  
    ray: number;  
    type_group: number;  
}  
export interface MarkRecord {  
    id: number;  
    name: string | null;  
    position_x: number | null;  
    position_y: number | null;  
    ray: number | null;  
    type_group: number | null;  
}
export interface Getimage {
    cook: string;
    Id: number;
    off?: number;
}
export interface Image {
    id: number;
    image: Blob;
}