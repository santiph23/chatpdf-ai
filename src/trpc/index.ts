
import { privateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server'
import { z } from 'zod';
import { db } from '@/db';
import { INFINITE_QUERY_LIMIT } from '@/lib/constants';

export const appRouter = router({
  // query to get data
  // mutation to modify data

  // Private
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx

    const files = await db.file.findMany({
      where: {
        userId
      }
    })

    return files
  }),

  getFileMessages: privateProcedure.input(z.object({
    limit: z.number().min(1).max(100).nullish(), // can be null
    cursor: z.string().nullish(),
    fileId: z.string()
  })).query(async ({ ctx, input }) => {
    const { cursor, fileId } = input;
    const { userId } = ctx

    const limit = input.limit ?? INFINITE_QUERY_LIMIT

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId
      }
    })

    if (!file) throw new TRPCError({code: "NOT_FOUND"})

    const messages = await db.message.findMany({
      take: limit + 1,
      where: {
        fileId
      },
      orderBy: {
        createdAt: "desc"
      },
      cursor: cursor ? {id: cursor} : undefined,
      select: {
        id: true,
        role: true,
        text: true
      }
    })

    let nextCursor: typeof cursor | undefined = undefined

    if (messages.length > limit) {
      const nextItem = messages.pop() // get last item
      nextCursor = nextItem?.id
    }

    return {
      messages,
      nextCursor // to know where to start if we fetch more later
    }
  }),

  deleteFile: privateProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx
    const { id } = input

    await fetch("http://localhost:3000/api/file", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'key': process.env.API_KEY!,
      },
      body: JSON.stringify({
        userId: userId,
        fileId: id,
      })
    })

  })

});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
