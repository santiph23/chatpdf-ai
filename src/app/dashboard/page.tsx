
"use client";

import { DataTable } from '@/components/data-table';
import { File, columns } from './columns';
import { trpc } from '@/app/_trpc/client';
import Loading from '@/components/loading';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import UploadForm from '@/components/dashboard/upload-form';
import { Button } from '@/components/ui/button';
import { VStack } from '@/components/stack';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {

  const { toast } = useToast()

  const { data, isLoading } = trpc.getUserFiles.useQuery()

  if (data) {
    const files: File[] = data.map((file) => {
      return {
        id: file.id,
        name: file.name!,
        type: file.type,
        size: file.size,
        status: file.status
      }
    })

    return (
      <VStack className="w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Files</CardTitle>
            <CardDescription>All the files you have uploaded will be displayed here</CardDescription>
          </CardHeader>
          <CardFooter>
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

          </CardFooter>
        </Card>

        {
          isLoading ? (
            <Loading />
          ) : (
            <DataTable columns={columns} data={files} />
          )
        }
      </VStack>
    )
  }
}
