import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://boostlearn.test'
// axios.defaults.baseURL = "https://fiw79edmyg.sharedwithexpose.com";

// Ajouter un interceptors pour les erreurs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log('something went wrong')
    }
    return Promise.reject(error)
  }
)

export default axios
