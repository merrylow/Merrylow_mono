'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  tableIdFromURL: string | null
}

const TableOrderClient = ({ tableIdFromURL }: Props) => {
  const [tableId, setTableId] = useState<string | null>(null)

  useEffect(() => {
    if (tableIdFromURL) {
      localStorage.setItem('merrylow_table_id', tableIdFromURL);
      setTableId(tableIdFromURL)
    } else {
      const fromStorage = localStorage.getItem('merrylow_table_id')
      if (fromStorage) setTableId(fromStorage)
    }
  }, [tableIdFromURL])

  return (
    <div>
      {tableId ? (
        <p className='text-lg'>You're ordering from Table {tableId}</p>
      ) : (
        <p className='text-lg text-gray-500'>
          No table ID detected <br />
          <Link href='/admin/qrcodes' className='text-blue-500'>Scan a qr code</Link>
        </p>
      )}
    </div>
  )
}

export default TableOrderClient