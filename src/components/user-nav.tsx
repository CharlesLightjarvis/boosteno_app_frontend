import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from '../axios'
import { useNavigate } from 'react-router-dom'
import { AvatarIcon } from '@radix-ui/react-icons'

export function UserNav() {
  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    photo: '',
  })
  const navigate = useNavigate()

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
  }

  useEffect(() => {
    // Récupère les informations de l'utilisateur authentifié depuis le backend
    axios
      .get('/api/v1/public/me')
      .then((response) => {
        setUser(response.data.user) // Assure-toi que la réponse contient un objet utilisateur
      })
      .catch((error) => {
        console.error('Error fetching user details:', error)
      })
  }, [])

  const photoPath = user.photo

  // Ajouter le préfixe complet pour l'URL de base
  const baseUrl = 'http://boostlearn.test/storage/' // Utilisez votre domaine
  const imageUrl = photoPath ? `${baseUrl}${photoPath}` : null

  const handleLogout = async () => {
    // Envoie la requête de déconnexion au backend
    const csrfToken = getCookie('XSRF-TOKEN')
    if (csrfToken) {
      console.log(decodeURIComponent(csrfToken))
      try {
        const response = await axios.post(
          '/api/v1/public/logout',
          {}, // Le corps est vide pour le logout
          {
            headers: {
              'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
            },
          }
        )
        console.log('Logout successful:', response.data)

        // Recharger la page après la déconnexion pour réinitialiser l'état
        window.location.assign('/sign-in')

        // Optionnel : si tu veux aussi rediriger après la déconnexion
        // navigate('/sign-in')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    } else {
      console.error('CSRF token not found')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-10 w-10'>
            {imageUrl ? (
              <AvatarImage
                src={imageUrl}
                alt='User photo'
                className='h-full w-full object-cover object-center'
              />
            ) : (
              <AvatarFallback>
                <AvatarIcon className='h-8 w-8' />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{`${user.name} ${user.surname}`}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
