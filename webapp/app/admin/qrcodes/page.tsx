import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

const TableQRGenerator = () => {
  const baseUrl = 'https://merrylow-web.vercel.app'
  const totalTables = 20; // loop through however many tables there are

  return (
    <div className='grid grid-cols-1 gap-6'>
      {Array.from({ length: totalTables }, (_, i) => {
        const tableId = i + 1
        const tableUrl = `${baseUrl}?table=${tableId}`

        return (
          <div key={tableId} className='p-4 border rounded'>
            <p className='mb-2'>Table {tableId}</p>

            <QRCodeSVG value={tableUrl} size={128} fgColor="#000" bgColor="#fff" />
          </div>
        );
      })}
    </div>
  )
}

export default TableQRGenerator