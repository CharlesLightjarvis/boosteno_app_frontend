import { z } from 'zod'

// Schéma mis à jour pour accepter les nombres pour "id" et "status"
export const userSchema = z.object({
  id: z.union([z.string(), z.number()]), // Accepter à la fois string et number pour l'id
  uuid: z.string(),
  cni: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  address: z.string(),
  photo: z.string().nullable(),
  status: z.union([z.boolean(), z.number()]), // Accepter à la fois boolean et number pour le statut
  joinedDate: z.string(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type User = z.infer<typeof userSchema>
