export default async function ApplicantDashboardPage() {
  // 🔹 Demo Data (replace with Supabase later)
  const applicant = {
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Under Review',
    applications: [
      {
        id: 'APP-001',
        program: 'AI Research Fellowship',
        submittedAt: '2026-02-10',
        status: 'Under Review',
      },
      {
        id: 'APP-002',
        program: 'Startup Incubator 2026',
        submittedAt: '2026-01-28',
        status: 'Shortlisted',
      },
    ],
  }

  return (
    <div className='max-w-7xl mx-auto px-6 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Applicant Dashboard
        </h1>
        <p className='text-gray-600 mt-2'>Welcome back, {applicant.name}</p>
      </div>

      {/* Profile Card */}
      <div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>
        <div className='space-y-2 text-sm text-gray-700'>
          <p>
            <span className='font-medium'>Email:</span> {applicant.email}
          </p>
          <p>
            <span className='font-medium'>Current Status:</span>{' '}
            <span className='inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full'>
              {applicant.status}
            </span>
          </p>
        </div>
      </div>

      {/* Applications Table */}
      <div className='bg-white rounded-xl shadow-sm p-6'>
        <h2 className='text-lg font-semibold mb-4'>Your Applications</h2>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead className='border-b text-left text-gray-500'>
              <tr>
                <th className='py-3 pr-6'>Application ID</th>
                <th className='py-3 pr-6'>Program</th>
                <th className='py-3 pr-6'>Submitted</th>
                <th className='py-3'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applicant.applications.map((app) => (
                <tr
                  key={app.id}
                  className='border-b last:border-none hover:bg-gray-50'
                >
                  <td className='py-4 pr-6 font-medium'>{app.id}</td>
                  <td className='py-4 pr-6'>{app.program}</td>
                  <td className='py-4 pr-6'>{app.submittedAt}</td>
                  <td className='py-4'>
                    <span className='inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full'>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
