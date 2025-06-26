import { z } from "zod";
import database from "../config/mongodb";
import { hashPassword } from "../helpers/bycrypt";


type UserType = {
    username: string;
    email: string;
    password: string;
}

const UserSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(5, { message: "Password must be at least 5 characters long" }),

})
class UserModel {
    static collection() {
        return database.collection<UserType>("users")
    }
    static async register(newUser: UserType) {
        UserSchema.parse(newUser)

        const existUser = await this.collection().findOne({
            $or: [
                { email: newUser.email },
                { username: newUser.username }
            ]
        })
        if (existUser)
            throw { message: "User/Email already exists", status: 400 }
        newUser.password = hashPassword(newUser.password)

        const result = await this.collection().insertOne(newUser)
        return result
    }
    static async findByEmail(email: string) {
        const user = await this.collection().findOne({ email })
        return user
    }
}

export default UserModel