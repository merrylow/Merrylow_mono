import TableOrderClient from '@/components/tableOrderClient'
import OrderFormClient from '@/components/orderFormClient'


interface PageProps {
  searchParams: Promise<{
    table?: string
  }>
}

const Home = async ({ searchParams }: PageProps) => {
  const { table } = await searchParams
  const tableId = table || ''

  return (
    <main className="relative w-full h-full min-h-screen space-y-5">
      <section className="w-[88%] mx-auto mt-9 space-y-3">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Welcome to MerryLow 👋</h1>
          <TableOrderClient tableIdFromURL={tableId} />
        </div>

        <OrderFormClient tableId={tableId} />
      </section>

      <section className="mb-16" />
    </main>
  )
}

export default Home