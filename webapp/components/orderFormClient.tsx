'use client'

import { useState } from 'react'
import { PlaceOrderButton } from '@/components/buttons'

type Props = {
  tableId: string
}

const OrderFormClient = ({ tableId }: Props) => {
  const [note, setNote] = useState('')
  const [productId, setProductId] = useState('') // actually menu_id in the db
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ tableId, productId, quantity, note })
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Product ID (menu_id)</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter menu item ID"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            title='quantity'
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any notes here (e.g. no onions)"
            className="textarea textarea-bordered w-full"
          />
        </div>
      </form>

      <PlaceOrderButton
        productId={productId}
        quantity={quantity}
        tableId={tableId}
        note={note}
      />
    </div>
  )
}

export default OrderFormClient