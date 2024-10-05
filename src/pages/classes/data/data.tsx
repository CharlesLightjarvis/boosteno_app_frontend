import {
  // ArrowDownIcon,
  // ArrowRightIcon,
  // ArrowUpIcon,

  // CircleIcon,
  AvatarIcon, // Représente un rôle d'administrateur
  PersonIcon, // Représente un rôle d'étudiant
  CommitIcon,
  ClockIcon,
  CheckIcon,
  CrossCircledIcon,
  // QuestionMarkCircledIcon,
  // StopwatchIcon,
} from '@radix-ui/react-icons'

export const roles = [
  {
    value: 'admin',
    label: 'Admin',
    icon: CommitIcon, // replace with the actual icon component
    color: 'text-red-600', // define badge color for admin
  },
  {
    value: 'teacher',
    label: 'Teacher',
    icon: AvatarIcon,
    color: 'text-green-600',
  },
  {
    value: 'student',
    label: 'Student',
    icon: PersonIcon,
    color: 'text-blue-600',
  },
]

export const statuses = [
  {
    value: 'ongoing',
    label: 'En cours',
    icon: ClockIcon,
    color: 'text-yellow-500',
  },
  {
    value: 'completed',
    label: 'Terminé',
    icon: CheckIcon,
    color: 'text-green-500',
  },
  {
    value: 'suspended',
    label: 'Suspendu',
    icon: CrossCircledIcon,
    color: 'text-red-500',
  },
]

// export const priorities = [
//   {
//     label: 'Low',
//     value: 'low',
//     icon: ArrowDownIcon,
//   },
//   {
//     label: 'Medium',
//     value: 'medium',
//     icon: ArrowRightIcon,
//   },
//   {
//     label: 'High',
//     value: 'high',
//     icon: ArrowUpIcon,
//   },
// ]
