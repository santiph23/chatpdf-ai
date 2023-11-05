"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from "../ui/use-toast"
import { useState } from 'react'
import { Loader2 } from "lucide-react"
import { Progress } from "../ui/progress"
import { Text } from "../text"
import { useRouter } from "next/navigation"

const UploadForm = () => {

  const router = useRouter()

  const { toast } = useToast()

  // uploading status
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const formSchema = z.object({
    file: z.instanceof(File)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  // UploadThing
  const { startUpload } = useUploadThing("pdfUploadFreeTrail")

  // Fake progress bar

  const startSimulatedProgress = () => {
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval)
          return prevProgress
        }
        return prevProgress + 5
      })
    }, 500)

    return interval
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {

    setIsUploading(true)

    const progressInterval = startSimulatedProgress()

    // Handle file
    const res = await startUpload([data.file])

    if (!res) {
      return toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }

    // File uploaded
    const [fileResponse] = res
    const key = fileResponse?.key
    console.log('Key is ', key)

    clearInterval(progressInterval)
    setUploadProgress(100)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4 p-8">

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input disabled={isUploading} accept=".pdf, .doc, .docx, .txt" type="file" name="file" onChange={(e: any) => {
                  const file = e.target.files?.[0]
                  field.onChange(file)
                }}
                  className="text-white"
                />
              </FormControl>

              {isUploading ? (
                <div className='w-full  mx-auto'>
                  <Progress
                    indicatorColor={
                      (uploadProgress === 100) ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className='h-1 w-full bg-zinc-200'
                  />
                  {(isUploading && uploadProgress !== 100) ? (
                    <Text level={0} className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Loading...
                    </Text>
                  ) : (
                    <Text level={0} className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                      Success
                    </Text>
                  )}
                </div>
              ) : null}

              <FormDescription>
                Supported File .pdf
              </FormDescription>
            </FormItem>
          )}
        />

        <Button disabled={isUploading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default UploadForm;

