import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { statuses } from '../../data/data'
import { Classe } from '../../data/schema'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons'

export const columns: ColumnDef<Classe>[] = [
  {
    id: 'select',
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && 'indeterminate')
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label='Select all'
    //     className='translate-y-[2px]'
    //   />
    // ),
    // cell: ({ row }) => (
    //   <Checkbox
    //     checked={row.getIsSelected()}
    //     onCheckedChange={(value) => row.toggleSelected(!!value)}
    //     aria-label='Select row'
    //     className='translate-y-[2px]'
    //   />
    // ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'uuid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uuid' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('uuid')}
        </span>
      </div>
    ),
  },

  // {
  //   accessorKey: 'students',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Étudiants' />
  //   ),
  //   cell: ({ row }) => {
  //     const students = row.getValue('students')
  //     return (
  //       <HoverCard>
  //         <HoverCardTrigger asChild>
  //           <span className='cursor-pointer text-blue-600'>
  //             {students.length} Étudiants
  //           </span>
  //         </HoverCardTrigger>
  //         <HoverCardContent className='w-64'>
  //           <div className='space-y-2'>
  //             {students.length > 0 ? (
  //               students.map((student: any, index: number) => (
  //                 <div key={index} className='flex items-center space-x-2'>
  //                   <span>
  //                     {student.name} {student.surname}
  //                   </span>
  //                 </div>
  //               ))
  //             ) : (
  //               <div>Aucun étudiant</div>
  //             )}
  //           </div>
  //         </HoverCardContent>
  //       </HoverCard>
  //     )
  //   },
  // },
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
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telephone' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('phone_number')}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
