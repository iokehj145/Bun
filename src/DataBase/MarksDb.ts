import { ObjectValues } from 'elysia/dist/types';
import * as face from '../Interfaces/MarksInterface';
import { Marks } from "../config/db.config";
// Create offer
export const AddMark = (mark: face.Mark, image: string): boolean => {
    const exists = Marks.query(`SELECT o.*, m.* FROM offers o INNER JOIN marks m ON o.position_x = m.position_x AND o.position_y = m.position_y WHERE o.position_x = '${mark.position[0]}' AND o.position_y = '${mark.position[1]}'`).all();
    if (!(exists.length > 0)) {
        Marks.run(`INSERT INTO offers (id, name, position_x, position_y, ray, type_group, image) VALUES 
        ((SELECT COALESCE(MAX(id), 0) + 1 FROM offers), '${mark.name}', '${mark.position[0]}', '${mark.position[1]}', '${mark.ray}', '${mark.type_group}', '${image}')`);
        return true;
    } else return false;
};
// Catch a group of marks
export const GetMarks = (group:string) : face.Mark[] => {
    return Marks.query(`SELECT * FROM marks WHERE ray = '${group}'`).all() as face.Mark[];
};
// Delete mark with image
export const DeleteMark = (ID: string) => {
    Marks.run(`DELETE FROM marks WHERE id = '${ID}';
               DELETE FROM images WHERE id = '${ID}'`);
};
// Delete offers
export const DeleteOffers = (ID: string) => {
    Marks.run(`DELETE FROM offers WHERE id = '${ID}';`);
};
export const ToMark = (ID: string) => {
    const NewMark = Marks.query(`SELECT * FROM offers WHERE id = '${ID}'`).get() as face.MarkDB;
    Marks.run(`DELETE FROM offers WHERE id = '${ID}';`);
    const nextId = Marks.query(`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM marks`).get() as { next_id: number };
    Marks.run(`INSERT INTO marks (id, name, position_x, position_y, ray, type_group) VALUES ('${nextId.next_id}', '${NewMark.name}', '${NewMark.position_x}', '${NewMark.position_y}', '${NewMark.ray}', '${NewMark.type_group}');
        INSERT INTO images (id, image) VALUES ('${nextId.next_id}', '${NewMark.image}')`);
}
// load image
export const GetImage = (Id: number, off: boolean) : face.Image => {
    return Marks.query(`SELECT image FROM ${off? 'offers':'images'} WHERE id = '${Id}';`).get() as face.Image
}