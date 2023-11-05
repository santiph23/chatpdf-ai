
"use client"

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { messageRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useRef, useState } from "react";

type StreamResponse = {
    addMessage: () => void
    message: string
    handleInputChange: (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({
    addMessage: () => { },
    message: "",
    handleInputChange: () => { },
    isLoading: false
})

interface Props {
    userId: string
    fileId: string
    children: ReactNode
}

// Wrap components
export const ChatContextprovider = ({ userId, children, fileId }: Props) => {

    // Context 
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }
    const addMessage = () => sendMessage({ message })
    //

    const utils = trpc.useContext()
    const backupMessage = useRef("")

    const { toast } = useToast()

    const { mutate: sendMessage } = useMutation({
        // Stream back response from api
        mutationFn: async ({ message }: { message: string }) => {

            // fetch req
            const response = await fetch("http://localhost:3000/api/message", {
                method: "POST",
                body: JSON.stringify({
                    message,
                    userId,
                    fileId
                })
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            return response.body
        },
        onMutate: async ({ message }) => {
            //optimistic update
            backupMessage.current = message
            setMessage("")

            // step 1
            await utils.getFileMessages.cancel()

            // step 2
            const prevMessages = utils.getFileMessages.getInfiniteData()

            // step 3
            // insert new message after sent
            utils.getFileMessages.setInfiniteData({
                fileId,
                limit: INFINITE_QUERY_LIMIT
            },
                (old) => {

                    // old date to add new data
                    if (!old) {
                        return {
                            pages: [],
                            pageParams: []
                        }
                    }

                    //clone old pages
                    let newPages = [...old.pages]

                    let latestPage = newPages[0]!

                    latestPage.messages = [
                        {
                            id: crypto.randomUUID(),
                            text: message,
                            role: "USER"
                        },
                        ...latestPage.messages
                    ]

                    // take prev messages and adding new

                    newPages[0] = latestPage

                    return {
                        ...old,
                        pages: newPages
                    }
                })

            setIsLoading(true) // after message sent add loading

            return {
                prevMessages: prevMessages?.pages.flatMap((page) => page.messages) ?? []
            }
        },
        onSuccess: async (stream) => {
            setIsLoading(false)

            if (!stream) {
                return toast({
                    title: 'Error sending messsage',
                    description: "Please refresh the window",
                    variant: "destructive"
                })
            }

            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false

            // accumulated respinse
            let accResponse = ""

            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)

                accResponse += chunkValue

                // add chunk to actual message, real time updates
                utils.getFileMessages.setInfiniteData(
                    { fileId, limit: INFINITE_QUERY_LIMIT },
                    (old) => {
                        if (!old) return { pages: [], pageParams: [] }

                        let isAiResponseCreated = old.pages.some(
                            (page) => page.messages.some(
                                (message) => message.id === "ai"
                            )
                        ) // check if there is any message in any page that has a-response id

                        let updatedPages = old.pages.map((page) => {
                            if (page === old.pages[0]) {
                                // we are on first message which contains last message
                                // first page contains last msg

                                let updatedMessages

                                if (!isAiResponseCreated) {
                                    // no ai response created yet

                                    // create new ai response
                                    updatedMessages = [
                                        {
                                            id: "ai",
                                            text: accResponse,
                                            role: "ASSISTANT" as messageRole
                                        },
                                        ...page.messages
                                    ]
                                } else {
                                    // there is ai response
                                    // add to existing response

                                    updatedMessages = page.messages.map((message) => {
                                        if (message.id == "ai") {
                                            return {
                                                ...message,
                                                text: accResponse
                                            }
                                        }
                                        return message
                                    })
                                }

                                return {
                                    ...page,
                                    messages: updatedMessages
                                }
                            }

                            return page
                        })

                        return {
                            ...old,
                            pages: updatedPages
                        }
                    }
                )
            }
        },
        onError: (_, __, context) => {
            setMessage(backupMessage.current)
            utils.getFileMessages.setData(
                { fileId },
                { messages: context?.prevMessages ?? [] }
            )
        },
        onSettled: async () => {
            setIsLoading(false)

            await utils.getFileMessages.invalidate({ fileId })
        }
    })

    return (
        <ChatContext.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
    )


}