
"use client"

// UI
import Image from "next/image";
import MainContainer from "../main-container";
import { HStack } from "../stack";
import { Text } from "../text";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Auth
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

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="user"
                                width={35}
                                height={35}
                                className=" rounded-lg"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/api/auth/logout">
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </HStack>
            </MainContainer>
        </nav >
    );
}

export default Navbar;