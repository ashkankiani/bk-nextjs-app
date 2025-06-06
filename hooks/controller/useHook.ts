import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {TypeRootState} from "@/store/store";
import {TypeApiPermissions, TypeApiSettings, TypeApiUsers} from "@/types/typeApi";

export default function useHook() {
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useSelector((state: TypeRootState) => state.app.initTheme)
  const isLogin = useSelector((state: TypeRootState) => state.user.isLogin)
  const user = useSelector((state: TypeRootState) => state.user.user) as TypeApiUsers
  const setting = useSelector((state: TypeRootState) => state.app.setting) as TypeApiSettings
  const permissions = useSelector((state: TypeRootState) => state.user.permissions) as TypeApiPermissions
  const searchQuery = useSelector((state: TypeRootState) => state.user.searchQuery)
  const cart = useSelector((state: TypeRootState) => state.user.cart)
  const order = useSelector((state: TypeRootState) => state.user.order)

  return {
    dispatch,
    router,
    theme,
    isLogin,
    user,
    setting,
    permissions,
    searchQuery,
    cart,
    order
  }
}
