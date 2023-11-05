
import { VStack } from "@/components/stack";
import ChatInput from "./chat-input";
import Messages from "./messages";
import { ChatContextprovider } from "./chat-context";

interface Props {
    userId: string
    fileId: string
}

// h-[calc(100vh-112px)] 
const ChatWrapper = ({ userId, fileId }: Props) => {
    return (
        <ChatContextprovider userId={userId} fileId={fileId}>
            <VStack className="relative flex flex-col justify-between border rounded-md">
                <VStack className="flex-1 justify-between flex flex-col">
                    <Messages fileId={fileId} />
                </VStack>
                <ChatInput isDisabled={false} />
            </VStack >
        </ChatContextprovider>
    );
}

export default ChatWrapper;
