import {
    TypeBankName,
    TypeDiscountsType,
    TypeGender,
    TypePaymentType,
    TypeReservationsStatus,
} from "@/types/typeConfig";
import {
    TypeApiCatalog,
    TypeApiConnection,
    TypeApiDiscount,
    TypeApiFaq,
    TypeApiHoliday,
    TypeApiPermission,
    TypeApiSetting,
    TypeApiUser,
} from "@/types/typeApiEntity";

export interface TypeReservationRes {
    id: number;

    orderId: number;

    paymentId: number;

    transactionId?: number;

    serviceId: number;

    providerId: number;

    userId: number;

    dateTimeStartEpoch: bigint;
    dateTimeEndEpoch: bigint;
    date: string;
    time: string;

    status: TypeReservationsStatus;

    createdAt: Date;
    updatedAt: Date;
}

export interface TypeDraftRes {
    createEpoch: bigint;

    serviceId: number;

    providerId: number;

    userId?: number;

    dateTimeStartEpoch: bigint;
    dateTimeEndEpoch: bigint;
    date: string;
    time: string;

    createdAt: Date;
    updatedAt: Date;
}


export interface TypeOrderRes {
    id: number;
    trackingCode: string;

    status: TypeReservationsStatus;

    userId: number;

    serviceId: number;

    providerId: number;

    paymentId: number;

    discountId?: number;

    price: number;
    discountPrice?: number;
    totalPrice: number;

    reservations: TypeReservationRes[];

    createdAt: Date;
    updatedAt: Date;
}

export interface TypePaymentRes {
    id: number;

    paymentType: TypePaymentType;

    userId: number;

    transactionId?: number;

    description?: string;

    orders: TypeOrderRes[];
    reservations: TypeReservationRes[];

    createdAt: Date;
    updatedAt: Date;
}

export interface TypeTransactionRes {
    id: number;

    bankName: TypeBankName;
    trackId: string;
    amount: number;
    cardNumber: string;
    authority: string;

    payments: TypePaymentRes[];
    reservations: TypeReservationRes[];

    createdAt: Date;
    updatedAt: Date;
}

export interface TypeApiService {
    id: number;

    userId: number;

    name: string;
    periodTime: number;
    price: number;
    capacity: number;

    startDate: string | null;
    endDate: string | null;

    gender: TypeGender;

    codPayment: boolean;
    onlinePayment: boolean;

    smsToAdminService: boolean;
    smsToAdminProvider: boolean;
    smsToUserService: boolean;

    emailToAdminService: boolean;
    emailToAdminProvider: boolean;
    emailToUserService: boolean;

    description: string | null;
    descriptionAfterPurchase: string | null;

    // providers: TypeProviderRes[];
    // timeSheets: TypeTimeSheetRes[];
    // orders: TypeOrderRes[];
    // reservations: TypeReservationRes[];
    // draft: TypeDraftRes[];

    createdAt: Date;
    updatedAt: Date;
}

export interface TypeApiProviders {
    id: number;

    serviceId: number;

    userId: number;

    slotTime: number;

    startDate: string | null;
    endDate: string | null;

    startTime: string | null
    endTime: string | null;

    status: boolean;
    workHolidays: boolean;
    description: string | null;

    // TimeSheets?: TypeTimeSheetRes[];
    // Orders?: TypeOrderRes[];
    // Reservations?: TypeReservationRes[];

    createdAt: Date;
    updatedAt: Date;
    // Draft?: TypeDraftRes[];
}


export interface TypeTimeSheetRes {
    id: number;

    serviceId: number;

    providerId: number;

    dayName: string;
    dayIndex: number;
    startTime: string;
    endTime: string;

    createdAt: Date;
    updatedAt: Date;
}


export interface TypeCatalogs {
    id: number;
    title: string;

    Users?: TypeApiUser[];
    Permissions?: Permissions[];
}


export interface TypeSessions {
    id: number;
    sessionToken: string;
    userId: number;

    expires: bigint; // چون در پرایسما BigInt است، اینجا از bigint استفاده می‌کنیم
}


export interface TypeOtpSms {
    id: number;
    mobile: string;
    expires: bigint;  // چون BigInt هستیم از bigint استفاده می‌کنیم
    createdAt: Date;
    updatedAt: Date;
}


/*<====================================>*/
// Faq
/*<====================================>*/
export interface TypeApiAddFaqReq {
    title: string;
    content: string;
}

export interface TypeApiAddFaqRes {
    Message: string
}

export interface TypeApiDeleteFaqReq {
    id: number;
}

export interface TypeApiDeleteFaqRes {
    Message: string
}

export type TypeApiGetFaqsRes = TypeApiFaq[]

export type TypeApiShowFaqReq = {
    id: number
}
export type TypeApiShowFaqRes = TypeApiFaq

export type TypeApiUpdateFaqReq = {
    id: number;
    title: string;
    content: string;
}

export interface TypeApiUpdateFaqRes {
    Message: string
}


/*<====================================>*/
// Holiday
/*<====================================>*/

export interface TypeApiAddHolidayReq {
    date: string;
    title: string;
}

export interface TypeApiAddHolidayRes {
    Message: string
}

export interface TypeApiDeleteHolidayReq {
    id: number;
}

export interface TypeApiDeleteHolidayRes {
    Message: string
}

export type TypeApiGetHolidaysRes = TypeApiHoliday[]

export type TypeApiShowHolidayReq = {
    id: number
}
export type TypeApiShowHolidayRes = TypeApiHoliday

export type TypeApiUpdateHolidayReq = {
    id: number;
    date: string;
    title: string;
}

export interface TypeApiUpdateHolidayRes {
    Message: string
}


/*<====================================>*/
// Discount
/*<====================================>*/

export interface TypeApiAddDiscountReq {
    title: string;
    code: string;
    startDate?: string | null
    endDate?: string | null
    type: TypeDiscountsType;
    amount: number;
}

export interface TypeApiAddDiscountRes {
    Message: string
}

export interface TypeApiDeleteDiscountReq {
    id: number;
}

export interface TypeApiDeleteDiscountRes {
    Message: string
}

export type TypeApiGetDiscountsRes = TypeApiDiscount[]

export type TypeApiShowDiscountReq = {
    id: number
}
export type TypeApiShowDiscountRes = TypeApiDiscount

export type TypeApiUpdateDiscountReq = {
    id: number;
    title: string;
    code: string;
    startDate?: string | null
    endDate?: string | null
    type: TypeDiscountsType;
    amount: number;
}

export interface TypeApiUpdateDiscountRes {
    Message: string
}


/*<====================================>*/
// Catalog
/*<====================================>*/
export interface TypeApiAddCatalogReq {
    title: string;
}

export interface TypeApiAddCatalogRes {
    Message: string
}

export interface TypeApiDeleteCatalogReq {
    id: number;
}

export interface TypeApiDeleteCatalogRes {
    Message: string
}

export type TypeApiGetCatalogsRes = TypeApiCatalog[]


/*<====================================>*/
// Permission
/*<====================================>*/
export type TypeApiShowPermissionReq = {
    id: number
}
export type TypeApiShowPermissionRes = TypeApiPermission

export type TypeApiUpdatePermissionReq = TypeApiPermission

export interface TypeApiUpdatePermissionRes {
    Message: string
}


/*<====================================>*/
// Connection
/*<====================================>*/
export type TypeApiGetConnectionsRes = TypeApiConnection[]

export type TypeApiUpdateConnectionReq = TypeApiConnection

export interface TypeApiUpdateConnectionRes {
    Message: string
}


/*<====================================>*/
// Email
/*<====================================>*/
export interface TypeApiSendEmailReq {
    content?: string
    title: string
    subject: string
    text: string
    email: string
    trackingCode: string
    dateName: string
    date: string
    time: string
    service: string
    provider: string
}

export interface TypeApiSendEmailRes {
    Message: string
}


/*<====================================>*/
// Sms
/*<====================================>*/
export type TypeApiSendSmsReq = object

export interface TypeApiSendSmsRes {
    status: boolean
    data: unknown
}


/*<====================================>*/
// Setting
/*<====================================>*/
export type TypeApiGetSettingsRes = TypeApiSetting[]

export type TypeApiUpdateSettingReq = TypeApiSetting

export interface TypeApiUpdateSettingRes {
    Message: string
}


/*<====================================>*/
// User
/*<====================================>*/
export interface TypeApiAddUserReq {
    title: string;
    code: string;
    startDate?: string | null
    endDate?: string | null
    amount: number;
}

export interface TypeApiAddUserRes {
    Message: string
}

export interface TypeApiDeleteUserReq {
    id: number;
}

export interface TypeApiDeleteUserRes {
    Message: string
}


export type TypeApiGetUsersRes = TypeApiUser & {
    catalog: TypeApiCatalog;
};

export type TypeApiShowUserReq = {
    id: number
}
export type TypeApiShowUserRes = TypeApiUser

export type TypeApiUpdateUserReq = {
    id: number;
    title: string;
    code: string;
    startDate?: string | null
    endDate?: string | null
    amount: number;
}

export interface TypeApiUpdateUserRes {
    Message: string
}
