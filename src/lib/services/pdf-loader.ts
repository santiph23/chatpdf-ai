
// Import necessary modules from external dependencies.
import { db } from "@/db"
import { Prisma, sources } from "@prisma/client"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { PrismaVectorStore } from "langchain/vectorstores/prisma"
// Import the 'env' object from the local 'config' module.

// Define an asynchronous function 'getChunkedDocsFromPDF'.
export async function pdfLoader(url: string, userId: string, fileId: string) {

    const response = await fetch(url)
    const blob = await response.blob()

    // Create a new instance of the 'PDFLoader' class with the 'PDF_PATH' from the 'env' object.
    const loader = new PDFLoader(blob)
    // Load the PDF document using the loader.
    const docs = await loader.load()

    // Create a new instance of 'RecursiveCharacterTextSplitter' with specified options.
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,        // Size of each text chunk.
        chunkOverlap: 200      // Overlap between consecutive text chunks.
    })

    // Split the loaded documents into smaller text chunks.
    const chunkedDocs = await textSplitter.splitDocuments(docs)

    const vectorStore = PrismaVectorStore.withModel<sources>(db).create(
        new OpenAIEmbeddings({
            openAIApiKey: process.env.OPEN_AI_KEY
        }),
        {
            prisma: Prisma,
            tableName: "sources",
            vectorColumnName: "vector",
            columns: {
                id: PrismaVectorStore.IdColumn,
                content: PrismaVectorStore.ContentColumn,
            },
        }
    );

    await vectorStore.addModels(
        await db.$transaction(
            chunkedDocs.map((doc) => {
                const content = doc.pageContent.replace(/\n/g, '')
                return db.sources.create({ data: { content: content, userId: userId, fileId: fileId } })
            })
        )
    );

    const chars = chunkedDocs.map((doc) => {
        return doc.pageContent.length
    })

    const sum = chars.reduce((a, b) => a + b, 0)

    return {
        chars: sum
    }
}