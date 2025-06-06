import HeadPage from "@/components/layout/HeadPage";
import PermissionDenied from "@/components/front-end/layout/PermissionDenied";
import LayoutPermissionDenied from "@/components/back-end/layout/LayoutPermissionDenied";
const UnAuthorized = () => {
  return (
    <>
      <HeadPage title="عدم دسترسی"/>
      <PermissionDenied/>
    </>
  )
}
UnAuthorized.getLayout = page => {
  return <LayoutPermissionDenied>{page}</LayoutPermissionDenied>
}
export default UnAuthorized