const steps = [
  {
    number: 1,
    title: 'EOI Submission',
    description: 'Submit your Expression of Interest with documents.',
  },
  {
    number: 2,
    title: 'IELTS Gate',
    description: 'Complete IELTS or access our prep program.',
  },
  {
    number: 3,
    title: 'Funding Assessment',
    description: 'Get conditional funding approval.',
  },
  {
    number: 4,
    title: 'Application Fee',
    description: 'Pay the application fee to proceed.',
  },
  {
    number: 5,
    title: 'University Application',
    description: 'We submit your application.',
  },
  {
    number: 6,
    title: 'Offer Received',
    description: 'Receive your university offer.',
  },
  {
    number: 7,
    title: 'Migration Agent',
    description: 'Agent assists with visa.',
  },
  {
    number: 8,
    title: 'Visa Granted',
    description: 'Visa approved – travel ready.',
  },
  {
    number: 9,
    title: 'Arrival & Support',
    description: 'Post-enrolment support active.',
  },
]

export default function HowItWorks() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
