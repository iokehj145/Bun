export const DownloadUsersDB = async(req:any, res:any) => {
    const {token} = req.params;
    if (process.env.AdminKey && token === process.env.AdminKey)
         return Bun.file('public/Users.sqlite');
    else return "NO!";
}