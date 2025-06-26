import bcrypt from "bcryptjs"

export function hashPassword(password: string) {
    return bcrypt.hashSync(password)
}
export function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword)
}