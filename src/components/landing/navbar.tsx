
// UI
import MainContainer from "../main-container";
import { HStack } from "../stack";
import { Text } from "../text";
import { Button } from "../ui/button";

import Link from "next/link";

const Navbar = () => {

    return (
        <nav>
            <MainContainer className="sticky h-14 inset-0 top-0 z-30 border-b">
                <HStack className="w-full h-14 space-x-4 justify-between items-center">
                    <Link
                        href="/"
                    >
                        <HStack className="text-center items-center justify-center space-x-2">
                            <Text level={1} className=" font-bold text-lg">
                                ChatPDF
                            </Text>
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center text-sm px-2 rounded-full">
                                AI
                            </div>
                        </HStack>
                    </Link>

                    <HStack className=" justify-between space-x-4">
                        <Link href="/api/auth/login">
                            <Button variant="ghost" size="sm">
                                Sign in
                            </Button>
                        </Link>

                        <Link href="/api/auth/login">
                            <Button size="sm">
                                Get started
                            </Button>
                        </Link>
                    </HStack>

                </HStack>
            </MainContainer>
        </nav>
    );
}

export default Navbar;