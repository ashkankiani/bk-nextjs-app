import { utils, writeFileXLSX } from 'xlsx'
import GeneratePdf from '@/components/layout/GeneratePdf'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { useState } from 'react'
import { RiSave3Line } from 'react-icons/ri'
import TheSpinner from '@/components/layout/TheSpinner'

export default function TheExport({ title, heading, loading, dataExport, keys }) {
  const [dropDownMenu, setDropDownMenu] = useState(false)

  const toggleDropDownMenu = () => {
    setDropDownMenu(current => !current)
  }
  const closeToggleDropDownMenu = () => {
    setDropDownMenu(false)
  }
  const refCloseToggleDropDownMenu = useDetectClickOutside({
    onTriggered: closeToggleDropDownMenu,
  })

  if (loading) {
    return (
      <div className="text-blue-500">
        <TheSpinner />
      </div>
    )
  } else {
    const handleDownloadExcel = async () => {
      //Had to create a new workbook and then add the header
      const wb = utils.book_new()
      utils.sheet_add_aoa(wb, heading)

      //Starting in the second row to avoid overriding and skipping headers
      const ws = utils.sheet_add_json(wb, dataExport, {
        skipHeader: true,
        origin: 'A2',
      })
      utils.book_append_sheet(wb, ws, 'Data')
      writeFileXLSX(wb, 'Report' + '.xlsx')
    }

    return (
      dataExport.length !== 0 && (
        <div className="relative flex grow" ref={refCloseToggleDropDownMenu}>
          <div className="export" onClick={toggleDropDownMenu}>
            <RiSave3Line className="ml-2 inline-flex align-middle" size="24px" />
            {/*<span className="hidden sm:inline-flex">ذخیره خروجی</span>*/}
            <span>{title}</span>
          </div>
          {dropDownMenu && (
            <div className="absolute right-0 top-14 z-20 w-full bg-primary-100 text-left">
              <div
                className="cursor-pointer p-4 hover:bg-primary-200"
                onClick={() => handleDownloadExcel()}
              >
                Excel
              </div>
              <div className="cursor-pointer p-4 hover:bg-primary-200">
                <GeneratePdf
                  type="TABLE"
                  data={dataExport}
                  keys={keys}
                  orientation="portrait"
                  title="PDF Portrait"
                />
              </div>
              <div className="cursor-pointer p-4 hover:bg-primary-200">
                <GeneratePdf
                  type="TABLE"
                  data={dataExport}
                  keys={keys}
                  orientation="landscape"
                  title="PDF Landscape"
                />
              </div>
            </div>
          )}
        </div>
      )
    )
  }
}
