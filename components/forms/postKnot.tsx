"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

import { KnotValidation } from "@/lib/validations/knot";
import { updateUser } from "@/lib/actions/user.action";
import { createKnot } from "@/lib/actions/knot.action";


interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostKnot({userId}:{userId:string}){
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(KnotValidation),
        defaultValues: {
            knot:'',
            accountId: userId
        },
    });

    const onSubmit=async(values: z. infer<typeof KnotValidation>)=>{
        await createKnot({
            text:values.knot,
            author:userId,
            communityId: null,
            path:pathname
        })

        router.push("/")
    }
    return(
        <>
        <Form {...form}>
            <form
                className=' mt-10 flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='knot'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Content
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                            <Textarea
                            rows={15}
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="bg-primary-500">
                    Connect Knot
                </Button>
            </form>
        </Form>
        </>
    )
}

export default PostKnot