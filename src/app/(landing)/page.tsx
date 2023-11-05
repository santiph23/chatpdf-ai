
import MainContainer from "@/components/main-container";
import { VStack } from "@/components/stack";
import { Text } from "@/components/text";

export default function HomePage() {
  
  return (
    <MainContainer className="mt-32">
      <VStack className=" items-center justify-center text-center space-y-10">

        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className='text-sm font-semibold text-gray-700'>
            Now available!
          </p>
        </div>

        <Text level={1} className="text-6xl md:text-7xl lg:text-8xl font-extrabold px-16 md:px-16 lg:px-32">
          Your Second Brain in the Cloud
        </Text>
        <Text level={2} className=" text-2xl font-medium text-primary/70">
          Boost Memory, Save Time
        </Text>
      </VStack>
    </MainContainer>
  )
}
