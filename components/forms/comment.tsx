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
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { CommentValidation } from "@/lib/validations/knot";
import { addCommentToKnot, createKnot } from "@/lib/actions/knot.action";
import Image from "next/image";

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ postId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      knot: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToKnot(postId, values.knot, JSON.parse(currentUserId), pathname)

    form.reset()

  };

  return (
    <Form {...form}>
      <form
        className="comment-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="knot"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image src={currentUserImg} alt="profile Image" width={48} height={48} className="rounded-full object-cover"/>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input type='text' placeholder="Comment..." className="no-focus text-light-1 outline-none" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
