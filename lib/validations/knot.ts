import * as z from 'zod'

export const KnotValidation = z.object({
    knot: z.string().min(3, {message:"Minimum 3 characters"}),

})


export const CommentValidation = z.object({
    knot: z.string().min(3, {message:"Minimum 3 characters"}),
})