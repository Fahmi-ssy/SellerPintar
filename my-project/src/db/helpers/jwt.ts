import jwt from "jsonwebtoken"
const SECRET = process.env.JWT_SECRET as string

import * as jose from "jose"

export const signToken = (payload:{ _id: string }) => {
    return jwt.sign(payload, SECRET)
}

export const verifyToken =  (token: string ) =>{
    return jwt.verify(token, SECRET)
}
export const verifyWithJose = async <T>(token : string ) =>{
    const secret = new TextEncoder().encode(SECRET)
    const { payload } = await jose.jwtVerify<T>(token, secret)
    return payload
}