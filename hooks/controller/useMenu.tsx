import { PiCoffee, PiPackageDuotone } from 'react-icons/pi'
import { TbBrandBooking, TbDiscount, TbPlugConnected, TbReport } from 'react-icons/tb'
import { MdRunningWithErrors } from 'react-icons/md'
import { BiHeart } from 'react-icons/bi'
import { BsFilePerson } from 'react-icons/bs'
import { RiQuestionLine, RiUserLine } from 'react-icons/ri'
import { AiOutlineSetting } from 'react-icons/ai'
import { LiaUserLockSolid } from 'react-icons/lia'
import useHook from '@/hooks/controller/useHook'
import { TypeMenu } from '@/types/typeConfig'

export default function useMenu() {
  const { permissions } = useHook()

  const menu: TypeMenu = {
    dashboard: {
      title: 'داشبورد',
      name: 'dashboard',
      icon: <PiPackageDuotone className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.admin,
    },
    reservation: {
      title: 'رزروها',
      name: 'reservations',
      icon: <TbBrandBooking className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewReservation,
    },
    draft: {
      title: 'در حال رزرو',
      name: 'drafts',
      icon: <MdRunningWithErrors className="text-primary-900 dark:text-primary-700" size="28px" />,
      permission: permissions.viewDraft,
    },
    services: {
      title: 'خدمات',
      name: 'services',
      icon: <BiHeart className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewServices,
    },
    providers: {
      title: 'ارائه دهندگان',
      name: 'providers',
      icon: <BsFilePerson className="text-primary-900 dark:text-primary-700" size="28px" />,
      permission: permissions.viewProviders,
    },
    financial: {
      title: 'امور مالی',
      name: 'financials',
      icon: <TbReport className="text-primary-900 dark:text-primary-700" size="28px" />,
      permission: permissions.viewFinancial,
    },
    holidays: {
      title: 'تعطیلات',
      name: 'holidays',
      icon: <PiCoffee className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewHolidays,
    },
    discounts: {
      title: 'تخفیف',
      name: 'discounts',
      icon: <TbDiscount className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewDiscounts,
    },
    users: {
      title: 'کاربران',
      name: 'users',
      icon: <RiUserLine className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewUsers,
    },
    faqs: {
      title: 'سوالات متداول',
      name: 'faqs',
      icon: <RiQuestionLine className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewFaqs,
    },
    settings: {
      title: 'تنظیمات',
      name: 'settings',
      icon: <AiOutlineSetting className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewSettings,
    },
    connections: {
      title: 'ارتباطات',
      name: 'connections',
      icon: <TbPlugConnected className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewConnections,
    },
    catalogs: {
      title: 'سطوح دسترسی',
      name: 'catalogs',
      icon: <LiaUserLockSolid className="text-primary-900 dark:text-primary-700" size="30px" />,
      permission: permissions.viewCatalogs,
    },
  }
  return { menu }
}
