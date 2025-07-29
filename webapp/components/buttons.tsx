'use client'

import React from 'react'
import usePlaceOrder from '@/hooks/usePlaceOrder'

type PlaceOrderButtonProps = {
  productName: string
  price: number
  tableId: number
  note: string
}

const PlaceOrderButton = ({
  productName,
  price,
  tableId,
  note,
}: PlaceOrderButtonProps) => {
  const { placeOrder } = usePlaceOrder()

  const handleSubmit = async () => {
    const { data, error } = await placeOrder({
      name: productName,
      price,
      table_no: tableId,
      note,
    })

    if (error) {
      console.error('Order placement failed:', error)
      return
    }

    // console.log('Order placed successfully:', data)
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