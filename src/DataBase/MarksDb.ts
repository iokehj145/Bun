import * as face from '../Interfaces/MarksInterface';
import { Marks } from "../config/db.config";

export const AddMark = (mark: face.Mark): boolean => {
    const exists = Marks.query(`SELECT 1 FROM marks WHERE position_x = '${mark.position_x}' AND position_y = '${mark.position_y}'`).all();
    if (exists.length < 1) {
        Marks.run(`INSERT INTO marks (id, name, position_x, position_y, type_group, group_name) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM marks), '${mark.name}', '${mark.position_x}', '${mark.position_y}', '${mark.type_group}', '${mark.group_name}')`);
        return true;
    } else return false;
};
export const GetMarks = (group:string) : face.Mark[] => {
    return Marks.query(`SELECT * FROM marks WHERE group_name = '${group}'`).all() as face.Mark[];
};
export const DeleteMark = (ID: string) => {
    Marks.run(`DELETE FROM marks WHERE id = '${ID}';`);
};