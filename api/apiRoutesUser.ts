import { TypeApiRoutesUser } from '@/types/typeConfig'

export const ApiRoutesUser: TypeApiRoutesUser = {
  Setting: {
    GetSettings: '/user/setting/getSettings',
  },
  Service: {
    GetServices: '/user/service/getServices',
  },
  Provider: {
    GetProvidersByServiceId: '/user/provider/getProvidersByServiceId?',
  },
  Auth: {
    SignIn: '/user/auth/signIn',
    SignInOtp: '/user/auth/signInOtp',
    SendCodeOtp: '/user/auth/sendCodeOtp',
    SignUp: '/user/auth/signUp',
    ResetPassword: '/user/auth/resetPassword',
    UpdateUser: '/user/auth/updateUser',
  },
  Reservation: {
    AvailableTimes: '/user/reservation/availableTimes?',
    GetReservationsByUserId: '/user/reservation/getReservationsByUserId?',
    AddReservations: '/user/reservation/addReservations',
  },
  Connection: {
    GetConnections: '/user/connection/getConnections',
  },
  Discount: {
    CheckDiscount: '/user/discount/checkDiscount?',
  },
  Gateway: {
    GetGateways: '/user/gateway/getGateways',
    CreateAuthority: '/user/gateway/createAuthority',
    VerifyPayment: '/user/gateway/verifyPayment',
  },
  Order: {
    AddOrder: '/user/order/addOrder',
    ShowOrder: '/user/order/showOrder?',
    UpdateOrder: '/user/order/updateOrder',
    GetOrderByAuthority: '/user/order/getOrderByAuthority?',
  },
  Faq: {
    GetFaqs: '/user/faq/getFaqs',
  },
  // Holiday: {
  //     GetHolidays: '/user/holiday/getHolidays',
  // },
}
