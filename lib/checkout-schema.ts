import { z } from "zod"

const req = (label: string, max: number) => z.string().trim().min(1, `Please enter your ${label}.`).max(max)

export const OrderSchema = z.object({
  customer: z.object({
    firstName: req("first name", 60),
    lastName: req("last name", 60),
    email: z.string().trim().email("Please enter a valid email.").max(200),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number."),
    address: req("street address", 200),
    city: req("city", 80),
    state: req("state", 40),
    zipCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code."),
    notes: z.string().trim().max(1000).optional().default(""),
  }),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(300),
        make: z.string().max(60).optional(),
        price: z.number().finite(),
        quantity: z.number(),
      }),
    )
    .min(1, "Your cart is empty."),
})

export type OrderInput = z.infer<typeof OrderSchema>
