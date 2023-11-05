
"use client"

import { trpc } from "@/app/_trpc/client";
import { Text } from "@/components/text";
import { INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton"
import Message from "./message";
import { messageRole } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./chat-context";
import { useIntersection } from "@mantine/hooks"

interface MessagesProps {
    fileId: string
}

const Messages = ({ fileId }: MessagesProps) => {

    // handle loading
    const { isLoading: isAIThinking } = useContext(ChatContext)

    const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true
    })

    const loadingMessage = {
        id: 'loading-message',
        text: (
            <span className="flex h-full items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
            </span>
        ),
        role: "ASSISTANT" as messageRole
    }

    const messages = data?.pages.flatMap((page) => page.messages) // for each page to get one level of array

    const combinedMessages = [
        ...(isAIThinking ? [loadingMessage] : []),
        ...(messages ?? []),
    ] // combine loading messages to all others

    const lastMessageRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastMessageRef.current,
        threshold: 1,
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])

    return (
        <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse overflow-y-auto py-16">
            {
                combinedMessages && combinedMessages.length > 0 ? (
                    // we have messages
                    combinedMessages.map((message, i) => {

                        const isNextMessageSamePerson = combinedMessages[i - 1]?.role === combinedMessages[i]?.role

                        // logic
                        if (1 === combinedMessages.length - 1) {
                            return <Message ref={ref} isNextMessageSamePerson={isNextMessageSamePerson} message={message} key={message.id} />
                        } else {
                            return <Message isNextMessageSamePerson={isNextMessageSamePerson} message={message} key={message.id} />
                        }
                    })
                ) : isLoading ? (
                    // loading
                    <div className="w-full flex flex-col gap-2">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <MessageSquare className="h-8 w-8 text-blue-500" />
                        <Text level={3} className=" font-semibold text-xl">You&apos;re all set!</Text>
                        <Text level={0} className="text-zinc-500 text-sm">
                            Ask your first question to get started
                        </Text>
                    </div>
                )
            }
        </div>
    );
}

export default Messages;