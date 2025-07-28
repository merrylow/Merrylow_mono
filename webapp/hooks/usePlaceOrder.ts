'use client'

import { supabase } from '@/lib/supabase'

type PlaceOrderInput = {
  menu_id: string
  quantity: number
  table_id: string
  note: string
}

export default function usePlaceOrder() {
  const placeOrder = async ({
    menu_id,
    quantity,
    table_id,
    note,
  }: PlaceOrderInput) => {
    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ table_id, note, status: 'pending' }])
      .select()
      .single()

    if (orderError || !orderData) {
      console.error('Failed to create order:', orderError)
      return { error: orderError }
    }

    // 2. Create order item linked to that order
    const { data: itemData, error: itemError } = await supabase
      .from('order_items')
      .insert([
        {
          order_id: orderData.id,
          menu_id,
          quantity,
        },
      ])

    if (itemError) {
      console.error('Failed to create order item:', itemError)
      return { error: itemError }
    }

    return { data: { order: orderData, items: itemData } }
  }

  return { placeOrder }
}
