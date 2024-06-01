import * as z from 'zod'

export const KnotValidation = z.object({
    knot: z.string().min(3, {message:"Minimum 3 characters"}),
    accountId:z.string(),

})


export const CommentValidation = z.object({
    knot: z.string().min(3, {message:"Minimum 3 characters"}),
})