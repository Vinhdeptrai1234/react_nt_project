import * as z from "zod";

export const hikeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  hikeDateEpoch: z.number().positive(),
  parking: z.boolean(),
  lengthKm: z.number().positive("Length must be > 0"),
  difficulty: z.enum(["Easy", "Moderate", "Hard"]),
  description: z.string().optional(),
  elevationGainM: z
    .number()
    .optional()
    .refine((v) => !v || v >= 0, "Elevation must be ≥ 0"),
  maxGroupSize: z
    .number()
    .optional()
    .refine((v) => !v || v > 0, "Group size must be > 0"),
});
