import { Card, CardContent } from '@/components/ui/Card'

export default function FAQPage() {
  const faqs = [
    {
      category: 'Eligibility',
      questions: [
        {
          q: 'Who can apply for the Engineering live pathway now?',
          a: 'Applicants with a verified 4-year engineering degree, IELTS ≥ 7.0, strong academics, and starting financial capacity to commence the process.',
        },
        {
          q: "What if I'm not eligible today?",
          a: "You're routed into a nurture plan—usually IELTS preparation, documentation improvements, and readiness milestones.",
        },
      ],
    },
    {
      category: 'IELTS',
      questions: [
        {
          q: 'What is the mini IELTS check on the home page?',
          a: 'A quick readiness signal for engagement. It helps you decide whether to proceed to full assessment.',
        },
        {
          q: 'Is the full IELTS assessment free?',
          a: 'Some parts can be free. Advanced assessment and guided programs may be gated behind payment depending on plan.',
        },
      ],
    },
    {
      category: 'Spouse / Couples Readiness',
      questions: [
        {
          q: 'Why does my spouse need to submit details?',
          a: 'Because we generate a Couples Readiness Score. A skilled spouse can materially improve household readiness and outcomes.',
        },
        {
          q: 'Does my spouse need a login?',
          a: 'Yes. Your spouse receives an invite link and creates a secure login to submit their profile and documents.',
        },
      ],
    },
    {
      category: 'Typical costs',
      questions: [
        {
          q: 'How should I think about the total cost?',
          a: (
            <>
              <p>
                There are two phases: mobilisation (before travel) and study +
                settlement (after enrolment).
              </p>
              <p className='mt-2 font-semibold'>
                Phase 1: Mobilisation (before travel)
              </p>
              <p>
                Tawanda starts by becoming admissions-ready and visa-ready.
                Typical items include:
              </p>
              <ul className='list-disc pl-5'>
                <li>IELTS test fee (paid to test provider)</li>
                <li>IELTS preparation (optional)</li>
                <li>Inttlnt application fee</li>
                <li>Visa application fees</li>
                <li>Medical exams</li>
                <li>Biometrics</li>
                <li>Flights</li>
                <li>Arrival buffer (recommended cash reserve)</li>
              </ul>
              <p className='mt-2'>
                If Rudo joins the plan, she may also have her own IELTS and
                documentation requirements, and household costs like
                medicals/biometrics can increase.
              </p>
              <p className='mt-2 font-semibold'>
                Phase 2: Study + settlement (after enrolment)
              </p>
              <ul className='list-disc pl-5'>
                <li>Tuition (varies by institution/program)</li>
                <li>Living expenses (rent, food, transport, utilities)</li>
                <li>
                  Loan servicing (if finance-assisted) — first 24 months
                  interest-only, then principal + interest after income
                  stabilises.
                </li>
              </ul>
              <p className='mt-2'>
                Use the Cost Estimator to model your situation. After intake, we
                provide a personalised cost map aligned to your timeline.
              </p>
            </>
          ),
        },
      ],
    },
    {
      category: 'Payments',
      questions: [
        {
          q: 'What payments do I make inside Inttlnt vs outside?',
          a: (
            <ul className='list-disc pl-5'>
              <li>
                <strong>Inside Inttlnt:</strong> IELTS program access (if
                chosen), application fee, migration services fee (if
                applicable), ancillary services
              </li>
              <li>
                <strong>Outside Inttlnt:</strong> IELTS test provider fee, visa
                fee, medicals, biometrics, flights, tuition, living
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      category: 'Partners',
      questions: [
        {
          q: 'Who can become a channel partner?',
          a: 'Professional bodies, associations, alumni networks, education agents, and trusted community operators with access to eligible candidates.',
        },
      ],
    },
  ]

  return (
    <div className='bg-white py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-center mb-4'>
          Frequently Asked Questions
        </h1>
        <p className='text-center text-gray-600 mb-8'>
          Find answers to common questions about Inttlnt pathways, IELTS, costs,
          and more.
        </p>

        {faqs.map((category) => (
          <div key={category.category} className='mb-10'>
            <h2 className='text-2xl font-bold mb-4'>{category.category}</h2>
            <div className='space-y-4'>
              {category.questions.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-2'>{item.q}</h3>
                    <div className='text-gray-700 prose prose-sm max-w-none'>
                      {item.a}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Still have questions?{' '}
            <a href='/contact' className='text-blue-600'>
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
