
import { cn } from "@/lib/utils";

const MainContainer = ({
    className,
    children
}: {
    className?: string,
    children: React.ReactNode
}) => {
    return ( 
        <div className={cn("w-screen px-16 md:px-32 h-full relative flex", className)}>
            {children}
        </div>
     );
}
 
export default MainContainer;