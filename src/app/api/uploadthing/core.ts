
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getUser } from "@/lib/services/auth";

// Custom 
import { db } from "@/db";

const uploadThing = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {

    // Free trail pdf upload
    pdfUploadFreeTrail: uploadThing({ pdf: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const user = await getUser()
            if (!user) throw new Error("Unauthorized");
            return { userId: user.id };
        })
        .onUploadError(async ({ error }) => {
            console.log("🛑 CORE uploadthing ERROR: ", error)
        })
        .onUploadComplete(async ({ metadata, file }) => {

            console.log("✅ CORE uploadthing SUCCESS")

            await fetch("http://localhost:3000/api/file", {
                method: 'POST',
                body: JSON.stringify({
                    fileKey: file.key,
                    fileSize: file.size,
                    fileName: file.name,
                    userId: metadata.userId
                })
            })
        })
    //

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;