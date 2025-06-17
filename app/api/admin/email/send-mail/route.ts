import {
    checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
    createSuccessResponseWithMessage,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import nodemailer from "nodemailer";
import {TypeApiConnection} from "@/types/typeApiAdmin";

const allowedMethods = ["POST"];

export async function POST(request: Request) {
    // بررسی مجاز بودن درخواست
    const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
    if (methodCheckResponse) return methodCheckResponse;

    // اعتبارسنجی توکن
    // const authResponse = await authenticateRequest(request);

    // if (!authResponse?.status) {
    //   return createErrorResponse(authResponse?.message);
    // }

    // دریافت اطلاعات داخل درخواست
    const body = await request.json();
    const {email, subject, text} = body;


    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        email,
        subject,
        text,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // دریافت داده های ارتباطات
        const connections: TypeApiConnection[] = await prisma.connections.findMany();

        if (!connections || !connections[0]) {
            return createErrorResponseWithMessage("دسترسی به ارتباطات مویثر نشد.");
        }

        const smtpURL = connections[0].smtpURL
        const smtpPort = connections[0].smtpPort
        const smtpUserName = connections[0].smtpUserName
        const smtpPassword = connections[0].smtpPassword

        if (!smtpURL || !smtpPort || !smtpUserName || !smtpPassword) {
            return createErrorResponseWithMessage("یکی از اطلاعات پیکربندی smtp مشکل دارد.");
        }


        // const errorData = checkRequiredFields({
        //     smtpURL,
        //     smtpPort,
        //     smtpUserName,
        //     smtpPassword,
        // });
        //
        // if (errorData) {
        //     return createErrorResponseWithMessage(errorData);
        // }

        // ساخت  smtp ایمیل
        const transporter = nodemailer.createTransport({
            host: smtpURL,
            port: smtpPort,
            auth: {
                user: smtpUserName,
                pass: smtpPassword
            }
        });


        // پیکربندی و ارسال ایمیل
        await transporter.sendMail({
            from: `"${process.env.NEXT_PUBLIC_SITE_NAME}" <${smtpUserName}>`, // sender address
            to: body.email,
            subject: body.subject,
            text: body.text,
            html: templateEmail(body),
        });

        return createSuccessResponseWithMessage('ایمیل با موفقیت ارسال شد.');
    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

type TypeTemplateEmail = {
    content?: string
    title: string
    trackingCode: string
    dateName: string
    date: string
    time: string
    service: string
    provider: string
}

// یاداوری تغییر تمپلیت و راهکار پیامک و ضروری بودن یا نبودن مقادیر ورودی بالا
function templateEmail(body: TypeTemplateEmail) {
    return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
\t<title></title>
\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
\t<style>
\t\t* {
\t\t\tbox-sizing: border-box;
\t\t}

\t\tbody {
\t\t\tmargin: 0;
\t\t\tpadding: 0;
\t\t}

\t\ta[x-apple-data-detectors] {
\t\t\tcolor: inherit !important;
\t\t\ttext-decoration: inherit !important;
\t\t}

\t\t#MessageViewBody a {
\t\t\tcolor: inherit;
\t\t\ttext-decoration: none;
\t\t}

\t\tp {
\t\t\tline-height: inherit
\t\t}

\t\t.desktop_hide,
\t\t.desktop_hide table {
\t\t\tmso-hide: all;
\t\t\tdisplay: none;
\t\t\tmax-height: 0px;
\t\t\toverflow: hidden;
\t\t}

\t\t.image_block img+div {
\t\t\tdisplay: none;
\t\t}

\t\t@media (max-width:620px) {
\t\t\t.image_block div.fullWidth {
\t\t\t\tmax-width: 100% !important;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tdisplay: none;
\t\t\t}

\t\t\t.row-content {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.stack .column {
\t\t\t\twidth: 100%;
\t\t\t\tdisplay: block;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tmin-height: 0;
\t\t\t\tmax-height: 0;
\t\t\t\tmax-width: 0;
\t\t\t\toverflow: hidden;
\t\t\t\tfont-size: 0px;
\t\t\t}

\t\t\t.desktop_hide,
\t\t\t.desktop_hide table {
\t\t\t\tdisplay: table !important;
\t\t\t\tmax-height: none !important;
\t\t\t}
\t\t}
\t</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
\t<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
\t\t<tbody>
\t\t\t<tr>
\t\t\t\t<td>
\t\t\t\t\t<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #132437;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-repeat: no-repeat; background-position: center top; color: #000000; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4011/blue-glow_3.jpg'); width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:35px;padding-left:30px;padding-right:30px;padding-top:35px;width:100%;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center" style="line-height:10px">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="max-width: 150px;"><img src="${process.env.NEXT_PUBLIC_FULL_PATH}/images/logo.png" style="display: block; height: auto; border: 0; width: 100%;" width="150"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center" style="line-height:10px">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="fullWidth" style="max-width: 600px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4011/top-rounded.png" style="display: block; height: auto; border: 0; width: 100%;" width="600"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t\t<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #132437;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000; width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;width:100%;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center" style="line-height:10px">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="max-width: 541px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4011/library_1.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="541"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t\t<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ff7d14; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4011/orange-gradient-wide.png'); background-repeat: no-repeat;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:5px;padding-top:25px;text-align:center;width:100%;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h1 style="margin: 0; color: #037b4b; direction: rtl; font-size: 26px; font-weight: normal; letter-spacing: normal; line-height: 180%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 46.800000000000004px;"><strong>${body.title}</strong></h1>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:20px;padding-left:15px;padding-right:15px;padding-top:20px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="color:#737487;direction:rtl;font-size:18px;line-height:180%;text-align:center;mso-line-height-alt:32.4px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;"><strong>مشخصات رزرو شما به شرح زیر است:</strong></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">&nbsp;</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${body.content !== undefined ? `<p style="margin: 0;">کد تخفیف: <strong><span style="color: #03a500;">${body.content}</span></strong></p>` : ``} 
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">کد پیگیری: <strong><span style="color: #03a500;">${body.trackingCode}</span></strong></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">روز: <strong><span style="color: #03a500;">${body.dateName}</span></strong></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">تاریخ: <strong><span style="color: #03a500;">${body.date}</span></strong></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">ساعت: <span style="color: #03a500;"><strong>${body.time}</strong></span></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">سرویس: <span style="color: #03a500;"><strong>${body.service}</strong></span></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">توسط: <span style="color: #03a500;"><strong>${body.provider}</strong></span></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t\t<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ff7d14;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top; color: #000000; width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center" style="line-height:10px">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="fullWidth" style="max-width: 600px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4011/bottom-rounded.png" style="display: block; height: auto; border: 0; width: 100%;" width="600"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:30px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #262b30; line-height: 1.2;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p dir="rtl" style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">2024-2026@ ${process.env.NEXT_PUBLIC_SITE_NAME}</span></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="padding-bottom:30px;padding-left:5px;padding-right:5px;padding-top:10px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #262b30; line-height: 1.2;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p dir="rtl" style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">اگر ترجیح می دهید از این لیست ایمیل های اطلاع رسانی دریافت نکنید، برای لغو اشتراک <a href="${process.env.NEXT_PUBLIC_FULL_PATH}">اینجا را کلیک کنید</a>.</span></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t</td>
\t\t\t</tr>
\t\t</tbody>
\t</table><!-- End -->
</body>

</html>`
}
