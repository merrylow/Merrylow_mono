'use client'

import React from 'react'
import usePlaceOrder from '@/hooks/usePlaceOrder'

type PlaceOrderButtonProps = {
  productId: string
  quantity: number
  tableId: string
  note: string
}

const PlaceOrderButton = ({
  productId,
  quantity,
  tableId,
  note,
}: PlaceOrderButtonProps) => {
  const { placeOrder } = usePlaceOrder()

  const handleSubmit = async () => {
    const { data, error } = await placeOrder({
      menu_id: productId,
      quantity,
      table_id: tableId,
      note,
    })

    if (error) {
      console.error('Order placement failed:', error)
      return
    }

    console.log('Order placed successfully:', data)
    // maybe redirect or toast user
  }

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className="bg-primary-main text-white px-6 py-2 text-sm rounded-md"
    >
      Submit Order
    </button>
  )
}

export { PlaceOrderButton }