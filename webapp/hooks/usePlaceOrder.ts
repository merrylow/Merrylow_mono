'use client'

import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

type PlaceOrderInput = {
  name: string
  price: string
  table_no: number
  note: string
}

type OrderData = {
  id: string
  name: string
  price: string
  table_no: number
  note: string
  status: string
  created_at: string
}

type PlaceOrderResponse = {
  data?: OrderData
  error: PostgrestError | null
}


export default function usePlaceOrder() {
  const placeOrder = async ({
    name,
    price,
    table_no,
    note,
  }: PlaceOrderInput): Promise<PlaceOrderResponse> => {
      const numericPrice = Number(price)

       // validate conversion
    if (isNaN(numericPrice)) {
      return { error: { message: 'Invalid price format', details: '', hint: '', name: '', code: 'INVALID_PRICE' } }
    }

    const { data, error } = await supabase
      .from('orders_demo')
      .insert({ 
        name, 
        table_no, 
        price: numericPrice, 
        note, 
        status: 'pending' 
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create order: ', error)
      return { error }
    }

    if (!data) {
      return { error: { message: 'No data returned', details: '', hint: '', name: '', code: 'PGRST116' } }
    }

    return { data, error: null }
  }

  return { placeOrder }
}