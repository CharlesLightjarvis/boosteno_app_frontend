import axios from '../../../axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AvatarIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  FaIdCard,
  FaFingerprint,
  FaPhone,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa'

interface ViewUserDialogProps {
  userId: string | number
}

export function ViewUserDialog({ userId }: ViewUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`api/v1/admin/users/${userId}`)
        setUser(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }

    if (isOpen) {
      fetchUser() // Fetch user only when the modal is opened
    }
  }, [isOpen, userId])

  const photoPath = user?.photo || null
  const baseUrl = 'http://boostlearn.test/storage/'
  const imageUrl = photoPath ? `${baseUrl}${photoPath}` : null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='mr-2' variant='ghost'>
          <EyeOpenIcon className='mr-2 h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent max-h-[82vh] overflow-y-scroll sm:max-w-[350px]'>
        <DialogHeader>
          <DialogTitle>Profil Utilisateur</DialogTitle>
        </DialogHeader>

        {user ? (
          <div className='p-4'>
            {/* Avatar and Basic Info */}
            <div className='flex flex-col items-center text-center'>
              <Avatar className='mb-4 h-24 w-24'>
                {imageUrl ? (
                  <AvatarImage
                    src={imageUrl}
                    alt={`${user.name} ${user.surname}`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <AvatarFallback>
                    <AvatarIcon className='h-12 w-12' />
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className='text-lg font-semibold'>
                {user.name} {user.surname}
              </h2>
              <p className='text-sm text-gray-600'>{user.email}</p>
              <p className='text-sm text-gray-600'>{user.address}</p>
              <p className='text-sm text-gray-600'>{user.role}</p>

              {/* Full Profile and Actions buttons */}
              <div className='mt-4 flex space-x-4'>
                <Button variant='outline'>Full Profile</Button>
                <Button variant='ghost'>Actions</Button>
              </div>
            </div>

            {/* Contact and User Information */}

            <div className='mt-6 space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <FaIdCard className='h-3 w-3' />
                  <Label>Cni:</Label>
                </div>
                <span>{user.cni}</span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <FaFingerprint className='h-3 w-3' />
                  <Label>Uuid:</Label>
                </div>
                <span>{user.uuid}</span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <FaPhone className='h-3 w-3' />
                  <Label>Téléphone:</Label>
                </div>
                <span>{user.phone_number}</span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  {user.status === 1 ? (
                    <FaCheckCircle className='h-3 w-3 text-green-500' />
                  ) : (
                    <FaExclamationCircle className='h-3 w-3 text-red-500' />
                  )}
                  <Label>Statut:</Label>
                </div>
                <span>{user.status === 1 ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
