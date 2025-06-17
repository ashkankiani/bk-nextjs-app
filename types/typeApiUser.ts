import {
    TypeGender,
} from "@/types/typeConfig";
import {TypeApiPermission, TypeApiProvider, TypeApiService, TypeApiUser} from "@/types/typeApiEntity";


/*<====================================>*/
// Auth
/*<====================================>*/
export interface TypeApiSignInReq {
    codeMeli: string,
    password: string
}
export interface TypeApiSignInOtpReq {
    mobile: string,
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
    permissions: TypeApiPermission
}

export interface TypeApiSendCodeOtpReq {
    mobile: string,
}

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

export interface TypeApiUpdateUserRes {
    Message: string
}


/*<====================================>*/
// Provider
/*<====================================>*/

export type TypeApiGetProvidersForServiceReq = {
    serviceId: number
};


export type TypeApiGetProvidersForServiceRes = TypeApiProvider & {
    service: Partial<TypeApiService>;
    user: Partial<TypeApiUser>;
};











