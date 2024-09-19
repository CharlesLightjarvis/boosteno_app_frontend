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

export function UserNav() {
  const [user, setUser] = useState({ name: '', surname: '', email: '' })
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
        navigate('/sign-in') // Redirige vers la page de connexion
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
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src='/avatars/01.png'
              alt={`${user.name} ${user.surname}`}
            />
            <AvatarFallback>
              {user.name.charAt(0)}
              {user.surname.charAt(0)}
            </AvatarFallback>
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
