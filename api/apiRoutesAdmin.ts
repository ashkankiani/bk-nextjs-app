import { TypeApiRoutesAdmin } from '@/types/typeConfig'
import {AvailableTimes} from "@/api/apisAdmin";

export const ApiRoutesAdmin: TypeApiRoutesAdmin = {
  Faq: {
    AddFaq: '/admin/faq/addFaq',
    DeleteFaq: '/admin/faq/deleteFaq?',
    GetFaqs: '/admin/faq/getFaqs',
    ShowFaq: '/admin/faq/showFaq?',
    UpdateFaq: '/admin/faq/updateFaq',
  },
  Holiday: {
    AddHoliday: '/admin/holiday/addHoliday',
    DeleteHoliday: '/admin/holiday/deleteHoliday?',
    GetHolidays: '/admin/holiday/getHolidays',
    ShowHoliday: '/admin/holiday/showHoliday?',
    UpdateHoliday: '/admin/holiday/updateHoliday',
  },
  Discount: {
    AddDiscount: '/admin/discount/addDiscount',
    DeleteDiscount: '/admin/discount/deleteDiscount?',
    GetDiscounts: '/admin/discount/getDiscounts',
    ShowDiscount: '/admin/discount/showDiscount?',
    UpdateDiscount: '/admin/discount/updateDiscount',
  },

  Catalog: {
    AddCatalog: '/admin/catalog/addCatalog',
    DeleteCatalog: '/admin/catalog/deleteCatalog?',
    GetCatalogs: '/admin/catalog/getCatalogs',
  },
  Permission: {
    ShowPermission: '/admin/permission/showPermission?',
    UpdatePermission: '/admin/permission/updatePermission',
  },

  Connection: {
    GetConnections: '/admin/connection/getConnections',
    UpdateConnection: '/admin/connection/updateConnection',
  },

  Email: {
    SendEmail: '/admin/email/sendEmail',
  },
  Sms: {
    SendSms: '/admin/sms/sendSms',
  },
  Setting: {
    GetSettings: '/admin/setting/getSettings',
    UpdateSetting: '/admin/setting/updateSetting',
  },
  User: {
    AddUser: '/admin/user/addUser',
    DeleteUser: '/admin/user/deleteUser?',
    GetUsers: '/admin/user/getUsers',
    ShowUser: '/admin/user/showUser?',
    UpdateUser: '/admin/user/updateUser',
    ImportUsers: '/admin/user/importUsers',
    GetUsersByCatalogId: '/admin/user/getUsersByCatalogId?',
  },
  Service: {
    AddService: '/admin/service/addService',
    DeleteService: '/admin/service/deleteService?',
    GetServices: '/admin/service/getServices',
    ShowService: '/admin/service/showService?',
    UpdateService: '/admin/service/updateService',
  },
  Provider: {
    AddProvider: '/admin/provider/addProvider',
    DeleteProvider: '/admin/provider/deleteProvider?',
    GetProviders: '/admin/provider/getProviders',
    ShowProvider: '/admin/provider/showProvider?',
    UpdateProvider: '/admin/provider/updateProvider',
    GetProvidersByServiceId: '/admin/provider/getProvidersByServiceId?',
  },
  TimeSheet: {
    AddTimeSheet: '/admin/timeSheet/addTimeSheet',
    DeleteTimeSheet: '/admin/timeSheet/deleteTimeSheet?',
    ShowTimeSheet: '/admin/timeSheet/showTimeSheet?',
  },
  Order: {
    GetOrders: '/admin/order/getOrders',
  },
  Reservation: {
    AddReservation: '/admin/reservation/addReservation',
    DeleteReservation: '/admin/reservation/deleteReservation?',
    GetReservations: '/admin/reservation/getReservations?', // default has Filter start and end Date
    // ShowReservation: '/admin/reservation/showReservation?',
    // UpdateReservation: '/admin/reservation/updateReservation',
    UpdateStatusReservation: '/admin/reservation/updateStatusReservation',
    ReminderReservation: '/admin/reservation/reminderReservation',
    AppreciationReservation: '/admin/reservation/appreciationReservation',
    AvailableTimes: '/admin/reservation/availableTimes?',
    GetReservationsByUserId: '/admin/reservation/getReservationsByUserId?',
  },
  Draft: {
    GetDrafts: '/admin/draft/getDrafts',
    DeleteDrafts: '/admin/draft/deleteDrafts', // all drafts
  },
}
