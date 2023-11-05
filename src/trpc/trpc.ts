

import { getUser } from '@/lib/services/auth';
import { TRPCError, initTRPC } from '@trpc/server';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
    const user = await getUser()

    if (!user || !user.id) throw new TRPCError({code: "UNAUTHORIZED"})

    return opts.next({
        ctx: { 
            // pass user id to any api route that uses isAuth
            userId: user.id,
            user
        }
    })
})
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure; // allows us to create an api endpoint, that any one can call, public api

// secure 
export const privateProcedure = t.procedure.use(isAuth)
