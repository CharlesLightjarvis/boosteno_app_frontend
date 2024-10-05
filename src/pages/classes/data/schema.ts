import { z } from 'zod'

// Schéma pour correspondre à la table
export const classeSchema = z.object({
  id: z.number(), // L'id est un entier
  uuid: z.string(), // UUID est une chaîne unique
  start_date: z.string(), // Les dates peuvent être sous forme de chaîne (format ISO)
  end_date: z.string(), // Idem pour la date de fin
  user_id: z.number(), // L'identifiant de l'utilisateur est un entier, lié à la clé étrangère
  number_session: z.number().min(1), // Le nombre de sessions est un entier minimum de 1
  presential: z.boolean(), // Indique si le cours est en présentiel
  status: z.enum(['ongoing', 'completed', 'suspended']), // Enum pour le statut
  created_at: z.string(), // Date de création sous forme de chaîne
  updated_at: z.string(), // Date de mise à jour sous forme de chaîne
})

export type Classe = z.infer<typeof classeSchema>
