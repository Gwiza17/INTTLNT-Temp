import { createClient } from '@/lib/supabase/server'

export default async function StagesPage() {
  const supabase = createClient()
  const { data: stages } = await supabase
    .from('stages')
    .select('*')
    .order('order', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stages</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA (days)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Owner</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stages?.map((stage) => (
              <tr key={stage.id}>
                <td className="px-6 py-4 whitespace-nowrap">{stage.order}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stage.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stage.default_sla_days}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stage.default_owner_role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}