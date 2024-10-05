import axios from '../../../axios'

// Fonction pour récupérer les utilisateurs depuis l'API avec axios
export async function classes() {
  try {
    const response = await axios.get(
      'http://boostlearn.test/api/v1/admin/classes' // URL correcte
    )

    console.log(response.data.data)
    return response.data.data // Retourner les utilisateurs récupérés
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}
