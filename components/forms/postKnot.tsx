"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { KnotValidation } from "@/lib/validations/knot";
import { createKnot } from "@/lib/actions/knot.action";
import { useOrganization } from "@clerk/nextjs";

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

function PostKnot({
    userId,
    isOnboarded,
    organization
}: {
    userId: string;
    isOnboarded: boolean;
    organization:string|null
}) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(KnotValidation),
        defaultValues: {
            knot: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof KnotValidation>) => {

        if (!isOnboarded) {
            router.push("/onboarding");
            return;
        }

        await createKnot({
            text: values.knot,
            author: userId,
            communityId: organization ?? null,
            path: pathname,
        });

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
                        Connect Knot
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default PostKnot;
