const steps = [
  {
    number: 1,
    title: 'Check readiness',
    description: 'IELTS + eligibility assessment to see where you stand.',
  },
  {
    number: 2,
    title: 'Get triaged',
    description: 'Apply now vs nurture vs ineligible—clear path forward.',
  },
  {
    number: 3,
    title: 'Build your pack',
    description: 'Documents + milestones + transparency for all stakeholders.',
  },
  {
    number: 4,
    title: 'Progress to outcomes',
    description: 'Funding → admission → visa with full visibility.',
  },
]

export default function HowItWorks4Steps() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
      {steps.map((step) => (
        <div
          key={step.number}
          className='bg-white p-6 rounded-lg shadow-sm border'
        >
          <div className='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4'>
            {step.number}
          </div>
          <h3 className='text-lg font-semibold mb-2'>{step.title}</h3>
          <p className='text-gray-600'>{step.description}</p>
        </div>
      ))}
    </div>
  )
}
