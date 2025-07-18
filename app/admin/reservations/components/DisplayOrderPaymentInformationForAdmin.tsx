import { IoClose } from 'react-icons/io5'
import { PNtoEN, textDiscountsType, textPaymentType, textBankName } from '@/libs/utility'
import { fullStringToDateObjectP, numberWithCommas } from '@/libs/convertor'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import GeneratePdf from '@/components/layout/GeneratePdf'
import { TypeApiGetReservationsRes } from '@/types/typeApiAdmin'

export default function DisplayOrderPaymentInformationForAdmin({
  item,
  close,
}: {
  item: TypeApiGetReservationsRes
  close: () => void
}) {
  const dataExport = []
  if (item.order.payment.transaction) {
    dataExport.push(['کد پیگیری', item.order.trackingCode])
    dataExport.push(['روش پرداخت', textPaymentType(item.order.payment.paymentType)])
    dataExport.push(['نام درگاه', textBankName(item.order.payment.transaction.bankName)])
    dataExport.push([
      'مبلغ واریزی )تومان(',
      numberWithCommas(item.order.payment.transaction.amount),
    ])
    dataExport.push(['شماره کارت', item.order.payment.transaction.cardNumber])
    dataExport.push(['شماره تراکنش', item.order.payment.transaction.trackId])
    dataExport.push(['شناسه ارجاع', item.order.payment.transaction.authority])
    dataExport.push([
      'تاریخ واریز',
      PNtoEN(
        fullStringToDateObjectP(
          item.order.payment.transaction.createdAt,
          'YYYY-MM-DDTHH:MM:SS.SSSZ'
        ).format('YYYY/MM/DD - HH:MM')
      ),
    ])
    if (item.order.discount && item.order.discountPrice) {
      dataExport.push([
        'کد تخفیف',
        item.order.discount.title + ')' + item.order.discount.code + '(',
      ])
      dataExport.push(['نوع تخفیف', textDiscountsType(item.order.discount.type)])
      dataExport.push([
        'میزان تخفیف',
        item.order.discount.type === 'CONSTANT'
          ? numberWithCommas(item.order.discount.amount)
          : item.order.discount.amount + ' ' + item.order.discount.type === 'CONSTANT'
            ? 'تومان'
            : 'درصد',
      ])
      dataExport.push(['مبلغ تخفیف شده )تومان(', numberWithCommas(item.order.discountPrice)])
    }
    dataExport.push(['مبلغ رزرو )تومان(', numberWithCommas(item.order.price)])
    dataExport.push(['مبلغ کل فاکتور )تومان(', numberWithCommas(item.order.totalPrice)])
    dataExport.push([
      'مبلغ درآمد )تومان(',
      item.order.discountPrice
        ? numberWithCommas(item.order.price - item.order.discountPrice)
        : numberWithCommas(item.order.price),
    ])
  } else {
    dataExport.push(['کد پیگیری', item.order.trackingCode])
    dataExport.push(['روش پرداخت', textPaymentType(item.order.payment.paymentType)])
    if (item.order.discount && item.order.discountPrice) {
      dataExport.push(['کد تخفیف', item.order.discount.code + ' ' + item.order.discount.title])
      dataExport.push(['نوع تخفیف', textDiscountsType(item.order.discount.type)])
      dataExport.push([
        'میزان تخفیف',
        (item.order.discount.type === 'CONSTANT'
          ? numberWithCommas(item.order.discount.amount)
          : item.order.discount.amount) +
          '-' +
          (item.order.discount.type === 'CONSTANT' ? 'تومان' : 'درصد'),
      ])
      dataExport.push(['مبلغ تخفیف شده )تومان(', numberWithCommas(item.order.discountPrice)])
    }
    dataExport.push(['مبلغ رزرو )تومان(', numberWithCommas(item.order.price)])
    dataExport.push(['مبلغ کل فاکتور )تومان(', numberWithCommas(item.order.totalPrice)])
    dataExport.push([
      'مبلغ درآمد )تومان(',
      item.order.discountPrice
        ? numberWithCommas(item.order.price - item.order.discountPrice)
        : numberWithCommas(item.order.price),
    ])
  }

  return (
    <div className="panel-wrapper-modal max-w-[500px]">
      <IoClose size="32px" onClick={close} className="absolute left-4 top-4 cursor-pointer" />
      <div className="panel-modal-title">مشخصات پرداخت ({item.order.trackingCode})</div>
      <div className="panel-modal-content">
        <div className="flex-center-between mb-4 flex-wrap gap-2">
          <div>روش پرداخت</div>
          <div>
            <div>{textPaymentType(item.order.payment.paymentType)}</div>
          </div>
        </div>
        {item.order.payment.transaction && (
          <>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>نام درگاه</div>
              <div>{textBankName(item.order.payment.transaction.bankName)}</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>مبلغ واریزی</div>
              <div>{numberWithCommas(item.order.payment.transaction.amount)} تومان</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>شماره کارت</div>
              <div dir="ltr">{item.order.payment.transaction.cardNumber}</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>شماره تراکنش</div>
              <div>{item.order.payment.transaction.trackId}</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>شناسه ارجاع</div>
              <div dir="ltr">{item.order.payment.transaction.authority}</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>تاریخ واریز</div>
              <div dir="ltr">
                {PNtoEN(
                  fullStringToDateObjectP(
                    item.order.payment.transaction.createdAt,
                    'YYYY-MM-DDTHH:MM:SS.SSSZ'
                  ).format('YYYY/MM/DD - HH:MM')
                )}
              </div>
            </div>
          </>
        )}
        {item.order.discount && item.order.discountPrice && (
          <>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>کد تخفیف</div>
              <div>
                {item.order.discount.title} ({item.order.discount.code})
              </div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>نوع تخفیف</div>
              <div>{textDiscountsType(item.order.discount.type)}</div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>میزان تخفیف</div>
              <div>
                {item.order.discount.type === 'CONSTANT'
                  ? numberWithCommas(item.order.discount.amount)
                  : item.order.discount.amount}{' '}
                {item.order.discount.type === 'CONSTANT' ? 'تومان' : 'درصد'}
              </div>
            </div>
            <div className="flex-center-between mb-4 flex-wrap gap-2">
              <div>مبلغ تخفیف شده</div>
              <div>{numberWithCommas(item.order.discountPrice)} تومان</div>
            </div>
          </>
        )}
        <div className="flex-center-between mb-4 flex-wrap gap-2">
          <div>مبلغ رزرو</div>
          <div>{numberWithCommas(item.order.price)} تومان</div>
        </div>
        <div className="flex-center-between mb-4 flex-wrap gap-2">
          <div>مبلغ کل فاکتور</div>
          <div>{numberWithCommas(item.order.totalPrice)} تومان</div>
        </div>
        <div className="flex-center-between mb-4 flex-wrap gap-2">
          <div>مبلغ درآمد</div>
          <div>
            {item.order.discountPrice
              ? numberWithCommas(item.order.price - item.order.discountPrice)
              : numberWithCommas(item.order.price)}{' '}
            تومان
          </div>
        </div>
        {item.order.payment.description && (
          <div className="mb-4">
            <div className="mb-4">توضیحات:</div>
            <div>
              <div>{item.order.payment.description}</div>
            </div>
          </div>
        )}
      </div>
      <div className="panel-modal-footer">
        <div className="panel-modal-confirm flex-center-center gap-2">
          <AiOutlineDollarCircle size="22px" />
          <GeneratePdf
            type="FACTOR"
            data={dataExport}
            orientation="portrait"
            title="پرینت فاکتور"
          />
        </div>
        <div className="panel-modal-close" onClick={close}>
          بستن
        </div>
      </div>
    </div>
  )
}
