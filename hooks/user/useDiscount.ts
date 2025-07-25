import { useMutation } from '@tanstack/react-query'
import { TypeApiCheckDiscountReq } from '@/types/typeApiUser'
import { CheckDiscount } from '@/api/apisUser'

function useCheckDiscount(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiCheckDiscountReq) => CheckDiscount(data),
    onSuccess: () => {},
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useCheckDiscount }
