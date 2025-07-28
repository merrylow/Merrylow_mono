// import axios from 'axios'
// import { supabase } from '@/lib/supabase'
// import { Product } from '@/lib/types'

// const fetchProducts = async (): Promise<{
//     products: Product[]
// }> => {

//     try {
//         const response = await axios.get('/api/products')
//         const products: Product[] = response.data.products

//         return { products }

//     } catch (error: any) {
//         console.error('Error fetching products:', error.message)
//         return { products: [] }
//     }
// }

// // async function placeOrder(tableId: string, items: any[]) {
// //     const { data, error } = await supabase
// //         .from('orders')
// //         .insert([
// //             {
// //                 table_id: Number(tableId),
// //                 items: items,
// //                 status: 'pending',
// //             },
// //         ])

// //     if (error) {
// //         console.error('Order failed:', error)
// //     } else {
// //         console.log('Order placed:', data)
// //     }
// // }

// export { fetchProducts }