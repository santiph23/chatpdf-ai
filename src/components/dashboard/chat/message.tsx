import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import ReactMarkdown from "react-markdown"
import { forwardRef } from 'react'

interface MessageProps {
    message: ExtendedMessage,
    isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({
    message, isNextMessageSamePerson
}, ref) => {
    return (
        <div ref={ref} className={cn("flex items-end p-4", {
            "justify-end bg-zinc-900/50": message.role === "USER",
            "justify-start bg-zinc-900": message.role === "ASSISTANT",
        })}>
            <div className={cn("relative flex h-8 w-8 aspect-square items-center justify-center", {
                " bg-zinc-800 rounded-sm": message.role === "USER",
                "bg-purple-800 rounded-sm": message.role === "ASSISTANT",
                invisible: isNextMessageSamePerson
            })}>
                {
                    //logo of uer
                    message.role === "USER" ? (
                        <Icons.user className=" fill-zinc-200 h-3/4 w-3/4" />
                    ) : (
                        <Icons.logo className=" fill-zinc-300 h-3/4 w-3/4" />
                    )
                }
            </div>
            <div className={cn("flex flex-col space-y-2 text-base w-full justify-start")}>
                <div className={cn(" px-4 py-2 rounded-lg inline-block text-white", {
                    // " text-white": message.role === "USER",
                    // " text-white": message.role === "ASSISTANT",
                    "rounded-br-none": !isNextMessageSamePerson && message.role === "USER",
                    "rounded-bl-none": !isNextMessageSamePerson && message.role === "ASSISTANT"
                })}>
                    {
                        typeof message.text === 'string' ? (
                            <ReactMarkdown className={cn("prose", {
                                "text-zinc-50": message.role === "USER",
                            })}>
                                {message.text}
                            </ReactMarkdown>
                        ) : (
                            message.text
                        )
                    }
                    {/* {
                       message.id !== "loading-message" ? (
                           <div className={cn("text-xs select-none mt-2 w-full text-right", {
                               "text-zinc-500": message.role === "ASSISTANT",
                               "text-blue-300": message.role === "USER"
                           })}>
                               date
                               {
                                   // format(new Date(message.cr))
                               }
                           </div>
                       ) : (
                           null
                       )
                   } */}
                </div>
            </div>
        </div>
    );
})

Message.displayName = 'Message';

export default Message;