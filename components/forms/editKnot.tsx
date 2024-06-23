"use client";
import { useForm, useWatch } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editKnot, fetchKnotById } from "@/lib/actions/knot.action";
import { useState, useEffect } from "react";
import GenerateThumbnail from "./generateImage";

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

function EditKnot({
    id,
    text,
    image,
}: {
    id:string,
    text:string,
    image:string,
}) {
    const router = useRouter();
    const [imageUrl, setImageUrl]=useState(image)

    const form = useForm({
        defaultValues: {
            knot: text,
            imageUrl:imageUrl,
        },
    });

    const { reset, setValue } = form;

    const knot = useWatch({
        control: form.control,
        name: 'knot',
      });
    
      useEffect(() => {
        reset({
          knot,
          imageUrl,
        });
      }, [imageUrl, knot, reset]);

    const onSubmit = async (values: any) => {
        await editKnot(id, values.knot, values.imageUrl);
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

                    <div className="flex flex-col pt-10">
                        <GenerateThumbnail 
                            setImage={setImageUrl}
                            image={imageUrl}
                        />
                    </div>

                    <Button type="submit" className="bg-primary-500">
                        Edit Knot
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default EditKnot;
