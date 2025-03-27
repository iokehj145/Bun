import * as face from '../Interfaces/MarksInterface';
import { Marks } from "../config/db.config";
/**  
 * Adds a new mark to the offers table if a mark with the same position doesn't exist  
 *   
 * @param mark - The mark data to add  
 * @param image - The image data to associate with the mark  
 * @returns boolean - True if mark was added successfully, false if a mark already exists at that position  
 */
export const AddMark = (mark: face.Mark, image: string): boolean => {  
    const Check = Marks.prepare(`SELECT o.*, m.* FROM offers o INNER JOIN marks m ON o.position_x = m.position_x AND o.position_y = m.position_y   
        WHERE o.position_x = ? AND o.position_y = ?`);  

    const Exists = Check.all(mark.position[0], mark.position[1])
    if (!(Exists.length > 0)) {
            const GetMaxId = Marks.prepare("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM offers")
            const NextId = (GetMaxId.get() as { next_id: number }).next_id;
            const Insert = Marks.prepare(`INSERT INTO offers (id, name, position_x, position_y, ray, type_group, image)   
                VALUES (?, ?, ?, ?, ?, ?, ?)`) 
            Insert.run( NextId, mark.name, mark.position[0], mark.position[1], mark.ray, mark.type_group, image )
        return true;
    } else return false;
}; 
/**  
 * Retrieves all marks belonging to a specific ray/group 
 *   
 * @param group - The ray/group ID to filter marks by  
 * @returns An array of Mark objects  
 */
export const GetMarks = (group: string): face.Mark[] => {
    const query = Marks.prepare("SELECT * FROM marks WHERE ray = ?");
    return query.all(group) as face.Mark[];
};
/**  
 * Deletes a mark and its associated image by ID  
 *   
 * @param ID - The ID of the mark to delete  
 */ 
export const DeleteMark = (ID: string) => {
    Marks.run(`DELETE FROM marks WHERE id = '${ID}';
               DELETE FROM images WHERE id = '${ID}'`);
};
/** 
 * - Delete offer
 * @param ID - The ID of the offer to delete  
 **/
export const DeleteOffers = (ID: string) => {
    Marks.run(`DELETE FROM offers WHERE id = '${ID}';`);
};
/**  
 * Transfers a record from the 'offers' table to 'marks' and 'images' tables
 * @param ID - The ID of the offer to transfer  
 **/ 
export const ToMark = (ID: string) => {
    const NewMark = Marks.query(`SELECT * FROM offers WHERE id = '${ID}'`).get() as face.MarkDB;
    Marks.run(`DELETE FROM offers WHERE id = '${ID}';`);
    const nextId = Marks.query(`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM marks`).get() as { next_id: number };
    Marks.run(`INSERT INTO marks (id, name, position_x, position_y, ray, type_group) VALUES ('${nextId.next_id}', '${NewMark.name}', '${NewMark.position_x}', '${NewMark.position_y}', '${NewMark.ray}', '${NewMark.type_group}');
        INSERT INTO images (id, image) VALUES ('${nextId.next_id}', '${NewMark.image}')`);
}
/**  
 * Retrieves an image from either 'offers' or 'images' table  
 *   
 * @param Id - The ID of the record containing the image  
 * @param off - Flag indicating which table to query (true for 'offers', false for 'images')  
 * @returns - The image data object
 */
export const GetImage = (Id: number, off: boolean) : face.Image => {
    const query = Marks.prepare(`SELECT image FROM ${off? 'offers':'images'} WHERE id = ?`);
    return query.get(Id) as face.Image
}