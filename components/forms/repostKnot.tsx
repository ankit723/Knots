"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { KnotValidation } from "@/lib/validations/knot";
import { createKnot, editKnot, fetchKnotById } from "@/lib/actions/knot.action";
import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";

function RepostKnot({
    id,
    author
}: {
    id:string,
    author:string
}) {
    const [knot, setKnot]=useState<any>({})
    const router = useRouter();
    const pathname=usePathname()
    

    const onLoad=async()=>{
        console.log("hello")
        setKnot((await fetchKnotById(id)).text)
    }
    onLoad()

    const form = useForm({
        resolver: zodResolver(KnotValidation),
        defaultValues: {
            knot: knot?.text
        },
    });

    const onSubmit = async (values: z.infer<typeof KnotValidation>) => {
        await createKnot({text:values.knot, author, communityId:null, path:pathname});
        router.push("/");
    };
    return (
        <>
            <Form {...form}>
                <form
                    className=" mt-10 flex flex-col justify-start gap-10"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="knot"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Content
                                </FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Textarea rows={15} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="bg-primary-500">
                        Edit Knot
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default RepostKnot;
