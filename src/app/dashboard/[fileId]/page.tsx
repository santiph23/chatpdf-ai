
import ChatWrapper from '@/components/dashboard/chat/chat-wrapper';
import { db } from '@/db';
import { getUser } from '@/lib/services/auth';
import { notFound, redirect } from 'next/navigation'

interface PageProps {
  params: {
    fileId: string
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { fileId } = params

  const user = await getUser()
  const userId = user?.id

  if (!user || !userId) redirect("/")

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  })

  if (!file) notFound()

  return (
    <ChatWrapper userId={userId} fileId={fileId} />
  );
}
