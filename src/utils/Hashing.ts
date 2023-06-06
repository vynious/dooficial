import bcrypt from "bcryptjs";



export const hash = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password,salt)
}
