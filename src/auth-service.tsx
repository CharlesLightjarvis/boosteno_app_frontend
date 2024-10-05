// authService.ts
import axios from './axios'

// Fonction pour vérifier si l'utilisateur est authentifié via une requête à /me
export const checkAuth = async () => {
  try {
    // Faire une requête à l'API pour vérifier l'état de l'utilisateur
    const response = await axios.get('/api/v1/public/me')

    // Si la requête réussit et renvoie un utilisateur valide
    if (response.status === 200 && response.data.user) {
      return { authenticated: true, role: response.data.user.role }
    } else {
      return { authenticated: false, role: null }
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification :",
      error
    )
    return { authenticated: false, role: null }
  }
}
