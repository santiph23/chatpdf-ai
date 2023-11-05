import { Loader2 } from "lucide-react";
import { VStack } from "./stack";
import { Text } from "./text";

const Loading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <VStack className="items-center flex flex-col justify-between gap-2">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <Text level={3} className="font-semibold text-xl">Loading</Text>
                    <Text level={0} className="text-zinc-500 text-sm">This won&apos;t take long.</Text>
                </div>
            </VStack>
        </div>
    );
}

export default Loading;