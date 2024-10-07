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
import { toast } from 'sonner'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeStudent } from '../../../../store/studentsSlice' // Importer removeStudent

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { id: classeId } = useParams() // Récupérer l'id de la classe depuis les paramètres de l'URL
  const student = row.original // Assure que chaque row contient bien l'objet "student"
  const dispatch = useDispatch() // Utiliser useDispatch pour appeler removeStudent

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!student.id) {
      toast.error('ID étudiant introuvable')
      return
    }

    setIsDeleting(true)

    try {
      // Appeler removeStudent via Redux thunk
      await dispatch(
        removeStudent({ classeId, studentId: student.id })
      ).unwrap()

      toast.success('Étudiant retiré de la classe avec succès')
      setOpenDeleteDialog(false)
    } catch (error) {
      console.error("Erreur lors du retrait de l'étudiant:", error)
      toast.error("Erreur lors du retrait de l'étudiant")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='flex items-center'>
      <Button variant='ghost' className='flex h-8 w-8 p-0'>
        <Link to={`/classes/show/${classeId}`}>
          <EyeOpenIcon className='mr-2 h-4 w-4' />
        </Link>
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
          <Link to={`/classes/edit/${classeId}`}>
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
            Êtes-vous sûr de vouloir retirer cet étudiant de la classe ? Cette
            action est irréversible.
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
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
