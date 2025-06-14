import {
    TypeBankName, TypeCancellationReservation,
    TypeDiscountsType, TypeEmailStatus,
    TypeGender,
    TypePaymentType,
    TypeReservationsStatus, TypeSmsName,
    TypeTheme
} from "@/types/typeConfig";

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

export interface TypeApiServices {
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






export interface TypeApiUsers {
    id: number;

    catalogId: number;

    codeMeli: string;
    fullName: string;
    mobile: string;
    email: string | null;
    password: string;

    gender: TypeGender;

    locked: boolean;

    // Providers?: TypeProviderRes[];
    // Orders?: TypeOrderRes[];

    createdAt: Date;
    updatedAt: Date;

    // Reservations?: TypeReservationRes[];
    // Payments?: TypePaymentRes[];
    // Services?: TypeApiServices[];
    // Draft?: TypeDraftRes[];

    // Profile?: Profile[]; // اگر بخوای فعالش کنی
    // Catalogs?: Catalogs[]; // اگر بخوای فعالش کنی
    // Session?: TypeSessions[];
}

export interface TypeCatalogs {
    id: number;
    title: string;

    Users?: TypeApiUsers[];
    Permissions?: Permissions[];
}


export interface TypeApiPermissions {
    id: number;

    catalogId: number;

    admin: boolean;
    viewDashboard: boolean;
    viewReservation: boolean;
    addReservation: boolean;
    editReservation: boolean;
    deleteReservation: boolean;
    viewDraft: boolean;
    deleteDraft: boolean;
    viewServices: boolean;
    addServices: boolean;
    editServices: boolean;
    deleteServices: boolean;
    viewProviders: boolean;
    addProviders: boolean;
    editProviders: boolean;
    deleteProviders: boolean;
    viewTimesheets: boolean;
    addTimesheets: boolean;
    deleteTimesheets: boolean;
    viewFinancial: boolean;
    viewHolidays: boolean;
    addHolidays: boolean;
    editHolidays: boolean;
    deleteHolidays: boolean;
    viewDiscounts: boolean;
    addDiscounts: boolean;
    editDiscounts: boolean;
    deleteDiscounts: boolean;
    viewUsers: boolean;
    addUsers: boolean;
    editUsers: boolean;
    deleteUsers: boolean;
    exportUsers: boolean;
    importUsers: boolean;
    viewFaqs: boolean;
    addFaqs: boolean;
    editFaqs: boolean;
    deleteFaqs: boolean;
    viewSettings: boolean;
    editSettings: boolean;
    viewConnections: boolean;
    editConnections: boolean;
    viewCatalogs: boolean;
    addCatalogs: boolean;
    editCatalogs: boolean;
    deleteCatalogs: boolean;
    getSms: boolean;
    getEmail: boolean;
}

export interface TypeSessions {
    id: number;
    sessionToken: string;
    userId: number;

    expires: bigint; // چون در پرایسما BigInt است، اینجا از bigint استفاده می‌کنیم
}

export interface TypeApiSettings {
    id: number;
    name: string;
    url: string;
    address: string;
    phone: string;
    theme: TypeTheme;

    minReservationDate: number;    // حداقل زمان شروع رزرو
    maxReservationDate: number;    // حداکثر زمان پایان رزرو
    minReservationTime: number;    // حداقل دقیقه قبل شروع رزرو
    cancellationDeadline: number;  // حداقل دقیقه مورد نیاز قبل از لغو
    maxReservationDaily: number;   // حداکثر تعداد رزرو روزانه کاربر
    maxReservationMonthly: number; // حداکثر تعداد نوبت در ماه

    automaticConfirmation: boolean;          // وضعیت پیش فرض رزرو
    cancellationReservationUser: boolean;    // امکان لغو رزرو برای کاربر
    // cancellationReservationProvider?: boolean; // اگر بخوای می‌تونی اضافه کنی

    smsCancellationReservation: TypeCancellationReservation;   // اطلاع رسانی پیامکی لغو رزرو
    emailCancellationReservation: TypeCancellationReservation; // اطلاع رسانی ایمیل لغو رزرو

    groupReservation: boolean;                // امکان رزرو گروهی
    emailStatus: TypeEmailStatus;        // وضعیت ایمیل در ایجاد کاربر

    shiftWorkStatus: boolean;                 // وضعیت باکس روزهای بدون نوبت کاری
    permissionSearchShiftWork: boolean;      // اجازه جستجوی نوبت کاری

    registerOTP: boolean; // ثبت نام کاربر با تایید شماره موبایل
    loginOTP: boolean;    // ورود کاربر با کد تایید یکبار مصرف پیامکی

    cart: boolean;               // وضعیت ایجاد سبد خرید
    minReservationLock: number;  // حداقل مدت زمان قفل نوبت انتخاب شده
    guestReservation: boolean;   // رزرو سریع به عنوان مهمان

    // headerCode?: string; // اگر بخوای می‌تونی فعالش کنی
    footerCode: string | null;
    code: string;

    createdAt: Date;
    updatedAt: Date;
}


export interface TypeApiConnections {
    id: number;

    bankName1: TypeBankName;
    merchantId1: string | null

    bankName2: TypeBankName;
    merchantId2: string | null

    smsName: TypeSmsName

    smsURL: string | null
    smsToken: string | null
    smsUserName: string | null
    smsPassword: string | null
    smsFrom: string | null

    smsCodePattern1: string | null;
    smsCodePattern2: string | null;
    smsCodePattern3: string | null;
    smsCodePattern4: string | null;
    smsCodePattern5: string | null;
    smsCodePattern6: string | null;
    smsCodePattern7: string | null;
    smsCodePattern8: string | null;

    smtpURL: string | null;
    smtpPort: number | null;
    smtpUserName: string | null;
    smtpPassword: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface TypeOtpSms {
    id: number;
    mobile: string;
    expires: bigint;  // چون BigInt هستیم از bigint استفاده می‌کنیم
    createdAt: Date;
    updatedAt: Date;
}


export interface TypeApiSignInRes {
    id: number;
    catalogId: number;
    codeMeli: string;
    fullName: string;
    mobile: string;
    email: string | null;
    lock: boolean
    providerIds?: number[];
    permissions: TypeApiPermissions
}

export type TypeApiGetProvidersForServiceRes = TypeApiProviders & {
    service: Partial<TypeApiServices>;
    user: Partial<TypeApiUsers>;
};


export interface TypeApiSendCodeOtpRes {
    Message: string
}


export interface TypeApiSignUpReq {
    codeMeli: string
    fullName: string
    email: string
    mobile: string
    password: string
}

export interface TypeApiSignUpRes {
    Message: string
}


export interface TypeApiResetPasswordReq {
    mobile: string
    password: string
}

export interface TypeApiResetPasswordRes {
    Message: string
}


export interface TypeApiUpdateUserReq {
    codeMeli: string
    fullName: string
    email?: string
    mobile: string
    password?: string
    gender: TypeGender
}


// Faq
export interface TypeApiFaq {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
}


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






// Holiday
export interface TypeApiHoliday {
    id: number
    title: string
    date: string
    createdAt: string
    updatedAt: string
}

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














// Discount
export interface TypeApiDiscount {
    id: number;
    title: string;
    code: string;
    startDate: string | null
    endDate: string | null
    type: TypeDiscountsType;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

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