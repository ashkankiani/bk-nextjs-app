type TypeApiRoutes = {
  key: string
  route: string
  method: string
}
export const apiRoutes: TypeApiRoutes[] = [
  {
    key: 'admin',
    route: '',
    method: 'GET',
  },
  {
    key: 'viewDashboard',
    route: '/api/admin/reservation',
    method: 'GET',
  },
  {
    key: 'viewReservation',
    route: '/api/admin/reservation',
    method: 'POST',
  },
  {
    key: 'addReservation',
    route: '/api/admin/service',
    method: 'GET',
  },
  {
    key: 'addReservation',
    route: '/api/admin/reservation',
    method: 'POST',
  },
  {
    key: 'addReservation',
    route: '/api/admin/user',
    method: 'POST',
  },
  {
    key: 'addReservation',
    route: '/api/admin/provider',
    method: 'POST',
  },
  {
    key: 'addReservation',
    route: '/api/admin/reservation/isReservation',
    method: 'POST',
  },
  {
    key: 'editReservation',
    route: '/api/admin/reservation/editReserve',
    method: 'PUT',
  },
  {
    key: 'editReservation',
    route: '/api/admin/reservation/changeStatusReserve',
    method: 'PUT',
  },
  {
    key: 'editReservation',
    route: '/api/admin/reservation/appreciationReserve',
    method: 'POST',
  },
  {
    key: 'editReservation',
    route: '/api/admin/reservation/reminderReserve',
    method: 'POST',
  },
  {
    key: 'editReservation',
    route: '/api/admin/reservation/isReservation',
    method: 'POST',
  },
  {
    key: 'deleteReservation',
    route: '/api/admin/reservation',
    method: 'DELETE',
  },
  {
    key: 'viewDraft',
    route: '/api/admin/draft',
    method: 'GET',
  },
  {
    key: 'deleteDraft',
    route: '/api/admin/draft',
    method: 'DELETE',
  },
  {
    key: 'viewServices',
    route: '/api/admin/service',
    method: 'GET',
  },
  {
    key: 'admin', // admin - addServices
    route: '/api/admin/user',
    method: 'GET',
  },
  {
    key: 'addServices',
    route: '/api/admin/service',
    method: 'POST',
  },
  {
    key: 'editServices',
    route: '/api/admin/service',
    method: 'PUT',
  },
  {
    key: 'deleteServices',
    route: '/api/admin/service',
    method: 'DELETE',
  },
  {
    key: 'viewProviders',
    route: '/api/admin/provider',
    method: 'GET',
  },
  {
    key: 'addProviders',
    route: '/api/admin/provider',
    method: 'POST',
  },
  {
    key: 'addProviders',
    route: '/api/admin/service',
    method: 'POST',
  },
  {
    key: 'editProviders',
    route: '/api/admin/provider',
    method: 'PUT',
  },
  {
    key: 'editProviders',
    route: '/api/admin/service',
    method: 'GET',
  },
  {
    key: 'editProviders',
    route: '/api/admin/user',
    method: 'GET',
  },
  {
    key: 'viewProviders',
    route: '/api/admin/service',
    method: 'GET',
  },
  {
    key: 'admin', // admin - viewProviders
    route: '/api/admin/user',
    method: 'GET',
  },
  {
    key: 'deleteProviders',
    route: '/api/admin/provider',
    method: 'DELETE',
  },
  {
    key: 'viewTimesheets',
    route: '/api/admin/provider',
    method: 'GET',
  },
  {
    key: 'viewTimesheets',
    route: '/api/admin/provider/timesheet',
    method: 'GET',
  },
  {
    key: 'addTimesheets',
    route: '/api/admin/provider/timesheet',
    method: 'POST',
  },
  {
    key: 'deleteTimesheets',
    route: '/api/admin/provider/timesheet',
    method: 'DELETE',
  },
  {
    key: 'viewFinancial',
    route: '/api/admin/order',
    method: 'GET',
  },
  {
    key: 'viewHolidays',
    route: '/api/admin/holiday',
    method: 'GET',
  },
  {
    key: 'addHolidays',
    route: '/api/admin/holiday',
    method: 'POST',
  },
  {
    key: 'editHolidays',
    route: '/api/admin/holiday',
    method: 'PUT',
  },
  {
    key: 'deleteHolidays',
    route: '/api/admin/holiday',
    method: 'DELETE',
  },
  {
    key: 'viewDiscounts',
    route: '/api/admin/discount',
    method: 'GET',
  },
  {
    key: 'addDiscounts',
    route: '/api/admin/discount',
    method: 'POST',
  },
  {
    key: 'editDiscounts',
    route: '/api/admin/discount',
    method: 'PUT',
  },
  {
    key: 'deleteDiscounts',
    route: '/api/admin/discount',
    method: 'DELETE',
  },
  {
    key: 'viewUsers',
    route: '/api/admin/user',
    method: 'GET',
  },
  {
    key: 'addUsers',
    route: '/api/admin/user',
    method: 'POST',
  },
  {
    key: 'editUsers',
    route: '/api/admin/user',
    method: 'PUT',
  },
  {
    key: 'deleteUsers',
    route: '/api/admin/user',
    method: 'DELETE',
  },
  {
    key: 'exportUsers',
    route: '/api/admin/user',
    method: 'GET',
  },
  {
    key: 'importUsers',
    route: '/api/admin/user/importUser',
    method: 'POST',
  },
  {
    key: 'viewFaqs',
    route: '/api/admin/faq',
    method: 'GET',
  },
  {
    key: 'addFaqs',
    route: '/api/admin/faq',
    method: 'POST',
  },
  {
    key: 'editFaqs',
    route: '/api/admin/faq',
    method: 'PUT',
  },
  {
    key: 'deleteFaqs',
    route: '/api/admin/faq',
    method: 'DELETE',
  },
  {
    key: 'viewSettings',
    route: '/api/admin/setting',
    method: 'GET',
  },
  {
    key: 'editSettings',
    route: '/api/admin/setting',
    method: 'PUT',
  },
  {
    key: 'viewConnections',
    route: '/api/admin/connection',
    method: 'GET',
  },
  {
    key: 'editConnections',
    route: '/api/admin/connection',
    method: 'PUT',
  },
  {
    key: 'viewCatalogs',
    route: '/api/admin/catalog',
    method: 'GET',
  },
  {
    key: 'addCatalogs',
    route: '/api/admin/catalog',
    method: 'POST',
  },
  {
    key: 'editCatalogs',
    route: '/api/admin/permission',
    method: 'PUT',
  },
  {
    key: 'editCatalogs',
    route: '/api/admin/permission',
    method: 'POST',
  },
  {
    key: 'deleteCatalogs',
    route: '/api/admin/catalog',
    method: 'DELETE',
  },
  {
    key: 'getSms',
    route: '/api/admin/sms',
    method: 'POST',
  },
  {
    key: 'getEmail',
    route: '/api/admin/email',
    method: 'POST',
  },
]
