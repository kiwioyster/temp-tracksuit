import { z } from "zod";

export const Insight = z.object({
  id: z.number().int().min(0),
  brand: z.number().int().min(0),
  createdAt: z.date(),
  text: z.string(),
});

export type Insight = z.infer<typeof Insight>;

// Interview notes - I have made the decision to share the schema across the FE and BE
// Pros - single source of truth, consistency
// Cons - tight coupling between FE and BE, more refactor work if we go for microservices architecture
// Alternative solution is to keep it separate but go for contract-first approach with swagger/open api
