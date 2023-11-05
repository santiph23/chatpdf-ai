
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db';
import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { z } from 'zod';
import { supabaseClient } from '@/lib/supabase';
import { getUser } from '@/lib/services/auth';

const validator = z.object({
    message: z.string(),
    fileId: z.string()
})

// Only POST req
export async function POST(request: NextRequest) {

    const { userId, fileId, message } = await request.json()
    console.log(userId, fileId, message)
    try {


        const mes: string = message
        await db.message.create({
            data: {
                text: mes,
                role: "USER",
                fileId,
                userId
            }
        })

        const file = await db.file.findFirst({
            where: {
                id: fileId,
                userId: userId
            }
        })

        if (!file) return new NextResponse("Not found", { status: 404 })


        // Semantic query is that for every text using ai lenguaje models can be converted a vector, the vector is a java array of numbers
        // Each text represented by a set of numbers called vector
        // Semantic query => quantify the meaning of a sentance

        // vectoreize input message
        // OpenAI recommends replacing newlines with spaces for best results
        const input = message.replace(/\n/g, ' ')

        // 1. create a embbeding for the message input
        // Generate a one-time embedding for the query itself
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input,
        })

        const [{ embedding }] = embeddingResponse.data
        const threshold = 0.73; // Set your similarity threshold here
        const limit = 5;

        // 2. using the message input embbeding, finde similar embbedings in db
        // const { data: documents, error } = await supabaseClient.rpc('match_documents', {
        //     query_embedding: embedding,
        //     match_threshold: .73, // Choose an appropriate threshold for your data
        //     match_count: 4, // Choose the number of matches
        // })

        const data = await db.$queryRaw`
        SELECT id, content, 1 - (vector <=> ${embedding}::vector) as similarity
        FROM sources
        WHERE 1 - (vector <=> ${embedding}::vector) > ${threshold}
        ORDER BY similarity DESC
        LIMIT ${limit};
        `

        const documents: any = data

        const contents = documents.map((doc: any) => doc.content)
        console.log("DOCUMENTS: ", contents)

        // const tokenizer = new GPT3Tokenizer()

        // 3. Join the data from allthe matched documents
        // Concat matched documents
        let contextText = ''
        for (let i = 0; i < documents.length; i++) {
            const document = documents[i]
            const content = document.content
            contextText += `${content.trim()}-- -\n`
        }

        // 4. Get prev message history
        // Get preve messsages history
        const prevMessages = await db.message.findMany({
            where: {
                fileId
            },
            orderBy: {
                createdAt: "asc"
            },
            take: 6
        })

        // formatt history messages
        const formattedPrevMessages = prevMessages.map((msg) => ({
            role: msg.role ? "USER" as const : "ASSISTANT" as const,
            content: msg.text
        }))

        // 5. using the chat history and the matched documents from the input and the input message, use ai to make a response
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            temperature: 0, // Set to 0 for deterministic results
            stream: true,
            // prev messages
            messages: [
                {
                    role: 'system',
                    content:
                        'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
                },
                {
                    role: 'user',
                    content: `Use the following pieces of context(or previous conversaton if needed) to answer the users question in markdown format.\nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

        \n----------------\n

          PREVIOUS CONVERSATION:
          ${formattedPrevMessages.map((message) => {
                        if (message.role === 'USER')
                            return `User: ${message.content}\n`
                        return `Assistant: ${message.content}\n`
                    })
                        }

        \n----------------\n

        CONTEXT:
          ${contextText}

          USER INPUT: ${message} `,
                },
            ],
        })

        const stream = OpenAIStream(response, {
            async onCompletion(completion) {
                console.log("RES: ", completion)
                // after sending back all data to user
                await db.message.create({
                    data: {
                        text: completion,
                        role: "ASSISTANT",
                        fileId,
                        userId
                    }
                })
            }
        }) // send back in real time to user

        return new StreamingTextResponse(stream)

    } catch (error) {
        console.log("🛑 POST message ERROR: ", error)
        return new NextResponse("Internal error", { status: 500 })

    } finally {
        console.log("✅ POST message SUCCESS")
    }

}
