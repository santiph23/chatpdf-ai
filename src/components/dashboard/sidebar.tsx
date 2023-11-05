"use client"

import { Banknote, File, MessagesSquare, Plus, Sparkles } from "lucide-react";
import { VStack } from "../stack";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import UploadForm from "./upload-form";

const routes = [
    {
        label: "Chat",
        icon: MessagesSquare,
        href: "/chat",
    },
    {
        label: "Files",
        icon: File,
        href: "/files",
    },
    {
        label: "Plans",
        icon: Banknote,
        href: "/plans",
    },
]

const Sidebar = ({ className }: { className?: string }) => {
    const pathname = usePathname()

    return (
        <VStack className={cn("flex flex-col pt-8 pb-8 w-52 h-full sticky", className)}>
            <div className="space-y-2 flex flex-col w-full flex-1">
                {routes.map((route) => (
                    <Link href={route.href} key={route.href}>
                        <Button variant={pathname === route.href ? "secondary" : "ghost"} className="w-full justify-start">
                            <div className="flex items-center flex-1">
                                <route.icon className={"h-4 w-4 mr-4"} />
                                {route.label}
                            </div>
                        </Button>
                    </Link>
                ))}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Plus className="w-4 h-4 mr-4" /> Upload
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <UploadForm />
                </DialogContent>
            </Dialog>
        </VStack>

    );
}

export default Sidebar;