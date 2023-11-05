
import { db } from '@/db';
import { user } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

export async function getUser(): Promise<user | null> {

    const session = await getSession()
    const sub: string = session?.user.sub
    const email: string = session?.user.email
    const name: string = session?.user.name

    if (!sub || !email) {
        console.log("🟨 Need to log in")
        return null
    }

    console.log("🟦 CREDENTIAL: ", sub, email, name)

    const user = await db.user.findUnique({
        where: {
            id: sub,
            email,
        }
    })

    if (!user) {
        const newUser = await db.user.create({
            data: {
                id: sub,
                email,
                name
            },
        })

        console.log("🟦 New user created: ", sub)

        return newUser
    }

    return user
}
