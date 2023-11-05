
import { NextRequest, NextResponse } from 'next/server'
import { pdfLoader } from '@/lib/services/pdf-loader';
import { db } from '@/db';

export async function POST(request: NextRequest) {
    
    const { userId, fileKey, fileSize, fileName } = await request.json()

    const url = `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${fileKey}`

    const file = await db.file.create({
        data: {
            size: fileSize,
            name: fileName,
            type: "PDF",
            chars: 0,
            url: url,
            status: "PROCESSING",
            userId: userId
        }
    })

    try {

        const loader = await pdfLoader(url, userId, file.id)

        const { chars } = loader

        // update file status
        const responseFile = await db.file.update({
            data: {
                status: "SUCCESS",
                chars: chars
            },
            where: {
                id: file.id
            }
        })

        return NextResponse.json(responseFile)

    } catch (error) {

        await db.file.update({
            data: {
                status: "FAILED",
            },
            where: {
                id: file.id
            }
        })

        console.log("🛑 POST file ERROR: ", error)

        return new NextResponse("Internal error", { status: 500 })

    } finally {
        console.log("✅ POST file SUCCESS")
    }
}
