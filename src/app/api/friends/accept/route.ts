import { z } from "zod"

export async function POST (req:Request) {
    try {
        const body = await req.json()

        const {id:idToAdd} = z.object({
            id:z.string()
        }).parse(body)
    } catch (error) {
        
    }
}