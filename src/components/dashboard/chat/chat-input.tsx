
"use client"

import { HStack } from "@/components/stack";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useContext, useRef } from "react";
import { ChatContext } from "./chat-context";

interface ChatInputProps {
    isDisabled?: boolean
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {

    // use functions from context
    const { addMessage, handleInputChange, isLoading, message } = useContext(ChatContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    return (
        <div className="absolute bottom-0 left-0 w-full">
            <div className="mx-4 mb-4">
                <HStack className=" items-center justify-between space-x-4">
                    <Textarea
                        ref={textareaRef}
                        rows={1}
                        maxRows={4}
                        autoFocus
                        value={message} // context
                        onChange={handleInputChange} // context
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                addMessage() // context
                                textareaRef.current?.focus()
                            }
                        }}
                        placeholder="Enter your question (max 1,000 characters"
                        className="resize-none text-base"
                    />

                    <Button
                        aria-label="Send message"
                        disabled={isLoading || isDisabled} // context
                        onClick={() => {
                            addMessage() // context
                            textareaRef.current?.focus()
                        }}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </HStack>
            </div>
        </div>
    )
}

export default ChatInput;