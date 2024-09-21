import {
  // ArrowDownIcon,
  // ArrowRightIcon,
  // ArrowUpIcon,
  CheckCircledIcon,
  // CircleIcon,
  AvatarIcon, // Représente un rôle d'administrateur
  PersonIcon, // Représente un rôle d'étudiant
  CrossCircledIcon,
  CommitIcon,
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
    value: 1,
    label: 'Actif',
    icon: CheckCircledIcon,
    color: 'text-green-600',
  },
  {
    value: 0,
    label: 'Inactif',
    icon: CrossCircledIcon,
    color: 'text-red-600',
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
