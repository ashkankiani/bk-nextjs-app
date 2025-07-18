import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import DocumentPdfTable from '@/components/layout/DocumentPdfTable'
import DocumentPdfFactor from '@/components/layout/DocumentPdfFactor'

const GeneratePdf = ({ type, title, keys, data, orientation }) => {
  return (
    <div>
      <PDFDownloadLink
        document={
          type === 'TABLE' ? (
            <DocumentPdfTable keys={keys} data={data} orientation={orientation} />
          ) : (
            <DocumentPdfFactor data={data} orientation={orientation} />
          )
        }
        fileName="file.pdf"
      >
        {({ loading }) => (loading ? 'بارگذاری...' : title)}
      </PDFDownloadLink>
    </div>
  )
}
// Create Document Component

export default GeneratePdf
