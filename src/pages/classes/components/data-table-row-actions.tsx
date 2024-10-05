import { DotsHorizontalIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store/store' // Remplace par le bon chemin vers store
import { deleteClass, fetchClasses } from '../../../store/classesSlice' // Action redux pour supprimer et récupérer les classes
import { toast } from 'sonner'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const classe = row.original
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  // Fonction pour gérer la suppression
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Appelle l'action Redux pour supprimer la classe
      await dispatch(deleteClass(classe.id)).unwrap()
      toast.success('Classe supprimée avec succès')

      // Actualiser les classes après la suppression
      await dispatch(fetchClasses())

      setOpenDeleteDialog(false)
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      toast.error('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='flex items-center'>
      <Button variant='ghost' className='flex h-8 w-8 p-0'>
        <EyeOpenIcon className='mr-2 h-4 w-4' />
        <span className='sr-only'>View</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <Link to={`/classes/edit/${classe.id}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onSelect={() => setOpenDeleteDialog(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog pour confirmation de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est
            irréversible.
          </p>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              loading={isDeleting}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
