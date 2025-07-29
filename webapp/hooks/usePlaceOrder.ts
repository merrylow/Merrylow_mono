'use client'

import { supabase } from '@/lib/supabase'

type PlaceOrderInput = {
  name: string
  price: number
  table_no: number
  note: string
}

export default function usePlaceOrder() {
  const placeOrder = async ({
    name,
    price,
    table_no,
    note,
  }: PlaceOrderInput) => {
    // creates the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders_demo')
      // .insert([{ name, table_no,price, note, status: 'pending' }])
      .insert({ name, table_no, price, note, status: 'pending' })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error('Failed to create order:', orderError)
      return { error: orderError }
    }

    // creates order item linked to that order
  //   const { data: itemData, error: itemError } = await supabase
  //     .from('order_items')
  //     .insert([
  //       {
  //         order_id: orderData.id,
  //         menu_id,
  //         quantity,
  //       },
  //     ])

  //   if (itemError) {
  //     console.error('Failed to create order item:', itemError)
  //     return { error: itemError }
  //   }

  //   return { data: { order: orderData, items: itemData } }
  }

  return { placeOrder }
}
