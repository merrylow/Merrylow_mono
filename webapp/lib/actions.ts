// import { createClient } from '@/lib/supabase/server'

// export const placeOrder = async ({
//   order_id,
//   menu_id,
//   quantity,
// }: {
//   order_id: string
//   menu_id: string
//   quantity: number
// }) => {
//   const supabase = createClient()

//   return await supabase.from('order').insert({
//     order_id,
//     menu_id,
//     quantity,
//   })
// }