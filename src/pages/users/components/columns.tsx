import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarIcon } from '@radix-ui/react-icons'

import { roles, statuses } from '../data/data'
import { User } from '../data/schema'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='ID' />
  //   ),
  //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'uuid',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Uuid' />
  //   ),
  //   cell: ({ row }) => (
  //     <div className='flex space-x-2'>
  //       <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.getValue('uuid')}
  //       </span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: 'photo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='' />,
    cell: ({ row }) => {
      const photoPath = row.getValue('photo')

      // Ajouter le préfixe complet pour l'URL de base
      const baseUrl = 'http://boostlearn.test/storage/' // Utilisez votre domaine
      const imageUrl = photoPath ? `${baseUrl}${photoPath}` : null

      // Déboguer l'URL générée
      console.log('Generated Image URL:', imageUrl)

      return (
        <div className='flex items-center space-x-2'>
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
        </div>
      )
    },
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nom' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('name')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'surname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prénom' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('surname')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'cni',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cni' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('cni')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('email')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = roles.find((role) => role.value === row.getValue('role'))

      if (!role) {
        return null
      }

      return (
        <Badge variant='outline'>
          {role.icon && <role.icon className={`mr-2 h-4 w-4 ${role.color}`} />}
          <span className={`font-medium ${role.color}`}>{role.label}</span>
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  // {
  //   accessorKey: 'phone_number',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Telephone' />
  //   ),
  //   cell: ({ row }) => (
  //     <div className='flex space-x-2'>
  //       <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.getValue('phone_number')}
  //       </span>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: 'address',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Addresse' />
  //   ),
  //   cell: ({ row }) => (
  //     <div className='flex space-x-2'>
  //       <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.getValue('address')}
  //       </span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: 'joinedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Adhésion' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('joinedDate')}
        </span>
      </div>
    ),
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <Badge variant='outline'>
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 ${status.color}`} />
          )}
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
