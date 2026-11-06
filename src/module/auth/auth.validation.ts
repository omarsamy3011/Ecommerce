import z from 'zod'

export const registerSchema = z.strictObject({
    name:z.string(),
    password:z.number().min(7).max(15),
    email:z.string().email(),
    age:z.number()
})