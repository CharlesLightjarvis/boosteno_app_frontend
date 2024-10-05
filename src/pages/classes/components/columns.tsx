import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { statuses } from '../data/data'
import { Classe } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'

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
  {
    accessorKey: 'teacher',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Professeur' />
    ),
    cell: ({ row }) => {
      const teacher = row.getValue('teacher')
      return teacher ? (
        <div>
          {teacher.name} {teacher.surname}
        </div>
      ) : (
        'Aucun professeur'
      )
    },
  },
  {
    accessorKey: 'students',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Étudiants' />
    ),
    cell: ({ row }) => {
      const students = row.getValue('students')
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className='cursor-pointer text-blue-600'>
              {students.length} Étudiants
            </span>
          </HoverCardTrigger>
          <HoverCardContent className='w-64'>
            <div className='space-y-2'>
              {students.length > 0 ? (
                students.map((student: any, index: number) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <span>
                      {student.name} {student.surname}
                    </span>
                  </div>
                ))
              ) : (
                <div>Aucun étudiant</div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    accessorKey: 'levels',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Niveau' />
    ),
    cell: ({ row }) => {
      const levels = row.getValue('levels')
      return levels && levels.length > 0 ? (
        <div>{levels.map((level: any) => level.name).join(', ')}</div>
      ) : (
        'Aucun niveau'
      )
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Debut' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('start_date')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Fin' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('end_date')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'presential',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Présentiel' />
    ),
    cell: ({ row }) => {
      const presential = row.getValue('presential')
      return (
        <Badge variant='outline'>
          {presential ? (
            <CheckIcon className='mr-2 h-4 w-4 text-green-500' />
          ) : (
            <CrossCircledIcon className='mr-2 h-4 w-4 text-red-500' />
          )}
          <span
            className={`font-medium ${presential ? 'text-green-500' : 'text-red-500'}`}
          >
            {presential ? 'Présentiel' : 'Non-présentiel'}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'number_session',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Séances' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('number_session')}
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

      if (!status) return null

      return (
        <Badge variant='outline'>
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 ${status.color}`} />
          )}
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
