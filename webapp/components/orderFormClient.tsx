'use client'

import { useState } from 'react'
import { PlaceOrderButton } from '@/components/buttons'

type Props = {
  tableId: number
}

const OrderFormClient = ({ tableId }: Props) => {
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ tableId, productName, price, note })
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Product name: </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="input input-bordered w-full"
            required
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">Price: </label>
          <input
            title='price'
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any notes here (e.g. no onions)"
            className="textarea textarea-bordered w-full"
          />
        </div>
      </form>

      <PlaceOrderButton
        productName={productName}
        price={price}
        tableId={tableId}
        note={note}
      />
    </div>
  )
}

export default OrderFormClient