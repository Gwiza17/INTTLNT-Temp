'use client'

import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Stethoscope,
  Code2,
  Wrench,
  BookOpen,
  Globe2,
  HandshakeIcon,
  Banknote,
  ClipboardCheck,
  Plane,
  GraduationCap,
  BarChart2,
  Users2,
  Medal,
} from 'lucide-react'

// ─── Photo palette ────────────────────────────────────────────────────────────
const P = {
  skyline:   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
  study:     'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80',
  lab:       'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?auto=format&fit=crop&w=1600&q=80',
  diverse:   'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
  lecture:   'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  handshake: '/images/channel-partner.jpg',
  partner2:  '/images/channel-partner-img.jpg',
  grad:      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
  toronto:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const pathways = [
  { Icon: Wrench,      field: 'Engineering',      degree: 'Master of Engineering Practice',   dest: 'Canada',    flag: '🇨🇦', href: '/engineering',      accent: '#3B82F6' },
  { Icon: Code2,       field: 'Computer Science',  degree: 'Master of Computer Science',       dest: 'Canada',    flag: '🇨🇦', href: '/computer-science', accent: '#8B5CF6' },
  { Icon: Stethoscope, field: 'Nursing',           degree: 'Master of Nursing Practice',       dest: 'Australia', flag: '🇦🇺', href: '/nursing',           accent: '#10B981' },
  { Icon: BookOpen,    field: 'Education',         degree: 'Bachelor of Teaching (STEM)',      dest: 'Canada',    flag: '🇨🇦', href: '/teaching',          accent: '#F59E0B' },
]

const steps = [
  { n: '01', Icon: ClipboardCheck, label: 'Free Diagnostic',     detail: 'Take our IELTS readiness test and unlock a personalised eligibility report at no cost.' },
  { n: '02', Icon: GraduationCap,  label: 'Match Your Pathway',  detail: 'We match your background, field, and goals to the best degree programme and destination.' },
  { n: '03', Icon: Banknote,       label: 'Secure Funding',      detail: 'Get connected with funders who can cover tuition, living costs, and visa fees.' },
  { n: '04', Icon: Plane,          label: 'Arrive & Thrive',     detail: 'Land with a confirmed place, a support network, and a clear route to residency.' },
]

const partnerBenefits = [
  { Icon: Users2,    title: 'Dedicated Portal',     body: 'Manage every candidate referral, track status, and see earnings in one clean dashboard.' },
  { Icon: Banknote,  title: 'Competitive Commissions', body: 'Earn structured fees per enrolled candidate, paid on a clear milestone schedule.' },
  { Icon: Globe2,    title: 'Global Network',        body: 'Join a growing network of partner agencies across Africa, South Asia, and the Middle East.' },
  { Icon: BarChart2, title: 'Growth Resources',      body: 'Access marketing materials, co-branded collateral, and priority support from your account manager.' },
]

const faqs = [
  { q: 'What countries can I study in?',               a: 'Currently Canada and Australia, with additional destinations being added. Each pathway page lists the specific destination and university partner.' },
  { q: 'Who is eligible to apply?',                    a: 'Skilled professionals with 2+ years of relevant experience in engineering, technology, healthcare, or education. Take the free diagnostic to confirm your eligibility.' },
  { q: 'How does education funding work?',             a: 'After your pathway is confirmed, you are matched with funding partners who can cover tuition, living expenses, and visa fees. Terms are disclosed upfront before you commit.' },
  { q: 'Do I need to sit an IELTS exam before applying?', a: 'No. You start with our free diagnostic tool which tells you where you stand. A formal IELTS test is only required at the point of university application.' },
  { q: 'How do I sign up as a Channel Partner?',      a: 'Submit an application via the Partner page. Once approved you get immediate portal access, onboarding materials, and a dedicated account manager.' },
  { q: 'How long does the full process take?',         a: 'From diagnostic to arrival typically runs 6–12 months, depending on your pathway and intake dates. Your personalised timeline is generated during the diagnostic.' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className='overflow-x-hidden font-sans antialiased bg-white text-gray-900'>
      <Header />

      {/* ═══════════════════════════════════════════════════════
          HERO — editorial full-bleed with bold split type
          ═══════════════════════════════════════════════════════ */}
      <section className='relative min-h-screen flex items-end pb-0 overflow-hidden'>

        {/* Background photo */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${P.skyline})` }}
        />

        {/* Dark gradient from bottom */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#060f1e] via-[#060f1ecc] to-transparent' />

        {/* Accent diagonal stripe */}
        <div
          className='absolute top-0 right-0 w-[45%] h-full opacity-20'
          style={{ background: 'linear-gradient(135deg, transparent 50%, #D97706 50%)' }}
        />

        {/* Content */}
        <div className='relative z-10 w-full'>
          <div className='max-w-7xl mx-auto px-6 lg:px-12 pt-40 pb-0'>

            {/* Eyebrow */}
            <div className='inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 mb-8'>
              <Globe2 size={12} /> Global Talent Pathways — Canada & Australia
            </div>

            {/* Headline */}
            <h1 className='text-white font-black leading-[0.92] tracking-tight mb-8' style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
              Your Career.<br />
              <span className='text-amber-400'>Fully Funded.</span><br />
              A World Away.
            </h1>

            <p className='text-gray-300 text-lg lg:text-xl max-w-xl mb-12 leading-relaxed'>
              Inttlnt connects skilled professionals with accredited degree programmes, funding, and careers in Canada and Australia — backed by a global partner network.
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap gap-4 mb-0'>
              <Link
                href='/eoi'
                className='inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/30'
              >
                Start Free Diagnostic <ArrowRight size={18} />
              </Link>
              <Link
                href='/partner/apply'
                className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 backdrop-blur-sm'
              >
                Become a Partner
              </Link>
            </div>
          </div>

          {/* Ticker strip */}
          <div className='mt-16 bg-amber-500 py-3 overflow-hidden'>
            <div className='flex gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap w-max'>
              {[
                '🇨🇦 Master of Engineering Practice',
                '🇦🇺 Master of Nursing Practice',
                '🇨🇦 Master of Computer Science',
                '🇨🇦 Bachelor of Teaching',
                '🎓 Funded Study Pathways',
                '🌏 Canada & Australia',
                '🇨🇦 Master of Engineering Practice',
                '🇦🇺 Master of Nursing Practice',
                '🇨🇦 Master of Computer Science',
                '🇨🇦 Bachelor of Teaching',
                '🎓 Funded Study Pathways',
                '🌏 Canada & Australia',
              ].map((item, i) => (
                <span key={i} className='text-black font-bold text-sm tracking-wide uppercase'>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          PATHWAYS — angled grid
          ═══════════════════════════════════════════════════════ */}
      <section className='bg-[#060f1e] py-28 px-6 lg:px-12'>
        <div className='max-w-7xl mx-auto'>

          <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16'>
            <div>
              <p className='text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3'>Live Pathways</p>
              <h2 className='text-white font-black text-5xl lg:text-6xl leading-tight'>4 programmes.<br />1 platform.</h2>
            </div>
            <p className='text-gray-400 max-w-sm text-base leading-relaxed'>
              Each pathway is a direct route to a recognised qualification, residency-ready career, and a new life abroad.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-white/10'>
            {pathways.map((pw, i) => (
              <Link
                key={i}
                href={pw.href}
                className='group relative flex flex-col justify-between p-8 min-h-[320px] border-r border-white/10 last:border-r-0 transition-all duration-300 hover:bg-white/5 overflow-hidden'
              >
                {/* Number */}
                <span className='absolute top-4 right-6 text-white/5 font-black text-8xl leading-none select-none group-hover:text-white/10 transition-colors'>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div>
                  {/* Icon */}
                  <div
                    className='w-12 h-12 rounded-xl flex items-center justify-center mb-6'
                    style={{ backgroundColor: pw.accent + '22', border: `1px solid ${pw.accent}44` }}
                  >
                    <pw.Icon size={22} style={{ color: pw.accent }} />
                  </div>

                  {/* Field */}
                  <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: pw.accent }}>{pw.field}</p>

                  {/* Degree */}
                  <h3 className='text-white font-bold text-lg leading-snug'>{pw.degree}</h3>
                </div>

                <div className='flex items-center justify-between mt-6'>
                  <span className='text-gray-400 text-sm'>{pw.flag} {pw.dest}</span>
                  <ArrowRight
                    size={16}
                    className='text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all'
                  />
                </div>

                {/* Bottom accent line */}
                <div
                  className='absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500'
                  style={{ backgroundColor: pw.accent }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STUDENTS — full-bleed magazine layout
          ═══════════════════════════════════════════════════════ */}
      <section className='relative overflow-hidden'>
        <div className='grid lg:grid-cols-2 min-h-[600px]'>

          {/* Photo */}
          <div className='relative min-h-[400px] lg:min-h-0'>
            <img
              src={P.study}
              alt='Students studying'
              className='absolute inset-0 w-full h-full object-cover object-top'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:to-transparent' />
          </div>

          {/* Content */}
          <div className='bg-[#0B1F3B] flex flex-col justify-center px-10 lg:px-16 py-20'>
            <p className='text-amber-400 font-bold uppercase tracking-widest text-xs mb-4'>For Students & Professionals</p>
            <h2 className='text-white font-black text-4xl lg:text-5xl leading-tight mb-6'>
              A degree abroad<br />shouldn't be a dream.
            </h2>
            <p className='text-gray-300 text-base leading-relaxed mb-10 max-w-md'>
              Thousands of skilled workers in engineering, healthcare, tech, and education are eligible for fully-supported study pathways. Your experience is your currency.
            </p>

            <ul className='space-y-4 mb-10'>
              {[
                'Free IELTS diagnostic — no commitment required',
                'Personalised pathway matched to your background',
                'Funding support for tuition, visa & living costs',
                'Pre-arrival orientation & post-landing support',
              ].map((item, i) => (
                <li key={i} className='flex items-start gap-3'>
                  <span className='w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
                      <path d='M1 4L3.5 6.5L9 1' stroke='black' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </span>
                  <span className='text-gray-200 text-sm'>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href='/eoi'
              className='self-start inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 text-sm'
            >
              Check My Eligibility <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PARTNERS — inverted layout
          ═══════════════════════════════════════════════════════ */}
      <section className='relative overflow-hidden'>
        <div className='grid lg:grid-cols-2 min-h-[600px]'>

          {/* Content first on mobile, second on desktop */}
          <div className='bg-white flex flex-col justify-center px-10 lg:px-16 py-20 order-2 lg:order-1'>
            <p className='text-[#0B1F3B] font-bold uppercase tracking-widest text-xs mb-4'>For Channel Partners</p>
            <h2 className='text-[#0B1F3B] font-black text-4xl lg:text-5xl leading-tight mb-6'>
              Grow your agency.<br />Change lives. Earn.
            </h2>
            <p className='text-gray-600 text-base leading-relaxed mb-10 max-w-md'>
              Become an accredited Inttlnt partner and unlock a pipeline of pre-qualified candidates, a dedicated portal, and structured commissions.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10'>
              {partnerBenefits.map((b, i) => (
                <div key={i} className='flex gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-[#0B1F3B]/8 flex items-center justify-center flex-shrink-0 border border-[#0B1F3B]/10'>
                    <b.Icon size={16} className='text-[#0B1F3B]' />
                  </div>
                  <div>
                    <p className='font-bold text-sm text-[#0B1F3B]'>{b.title}</p>
                    <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>{b.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href='/partner/apply'
              className='self-start inline-flex items-center gap-2 bg-[#0B1F3B] hover:bg-[#0B1F3B]/90 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 text-sm'
            >
              Apply to Partner <ArrowRight size={16} />
            </Link>
          </div>

          {/* Photo */}
          <div className='relative min-h-[400px] lg:min-h-0 order-1 lg:order-2'>
            <img
              src={P.handshake}
              alt='Channel partner meeting'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-l from-transparent to-black/20 lg:to-transparent' />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — numbered editorial
          ═══════════════════════════════════════════════════════ */}
      <section className='py-28 px-6 lg:px-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>

          <div className='text-center mb-20'>
            <p className='text-amber-500 font-bold uppercase tracking-widest text-xs mb-3'>The Pathway</p>
            <h2 className='text-[#0B1F3B] font-black text-5xl lg:text-6xl'>From here to there.</h2>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {steps.map((s, i) => (
              <div key={i} className='relative'>
                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className='hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-full h-px bg-gradient-to-r from-amber-300 to-transparent z-0' />
                )}

                <div className='relative z-10'>
                  {/* Step number */}
                  <p className='text-8xl font-black text-amber-100 leading-none mb-2 select-none'>{s.n}</p>

                  <div className='w-14 h-14 rounded-2xl bg-[#0B1F3B] flex items-center justify-center mb-5 -mt-8 relative z-10 shadow-lg'>
                    <s.Icon size={24} className='text-amber-400' />
                  </div>

                  <h3 className='font-black text-xl text-[#0B1F3B] mb-2'>{s.label}</h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PHOTO BREAK — graduation moment
          ═══════════════════════════════════════════════════════ */}
      <section
        className='relative py-36 px-6 bg-fixed bg-cover bg-center'
        style={{ backgroundImage: `url(${P.grad})` }}
      >
        <div className='absolute inset-0 bg-[#060f1e]/75' />
        <div className='relative z-10 max-w-4xl mx-auto text-center'>
          <Medal size={40} className='text-amber-400 mx-auto mb-6' />
          <h2 className='text-white font-black text-4xl lg:text-6xl leading-tight mb-6'>
            A credential that opens doors.<br />
            <span className='text-amber-400'>A new country to open them in.</span>
          </h2>
          <p className='text-gray-300 text-lg max-w-2xl mx-auto mb-10'>
            Inttlnt graduates don't just get a degree — they get a career pathway, a community, and a clear route to permanent residency.
          </p>
          <Link
            href='/livepathways'
            className='inline-flex items-center gap-2 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold px-8 py-4 rounded-full transition-all duration-200 text-base'
          >
            Explore All Pathways <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ — clean stacked
          ═══════════════════════════════════════════════════════ */}
      <section className='py-28 px-6 lg:px-12 bg-white'>
        <div className='max-w-7xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-16'>

          {/* Left — sticky label */}
          <div className='lg:sticky lg:top-24 self-start'>
            <p className='text-amber-500 font-bold uppercase tracking-widest text-xs mb-3'>FAQ</p>
            <h2 className='text-[#0B1F3B] font-black text-4xl lg:text-5xl leading-tight mb-6'>Questions<br />answered.</h2>
            <p className='text-gray-500 text-sm leading-relaxed'>
              Can't find what you're looking for? Reach out via the contact page and we'll respond within one business day.
            </p>
            <Link href='/contact' className='inline-flex items-center gap-1 text-amber-600 font-semibold text-sm mt-4 hover:underline'>
              Contact us <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — accordion */}
          <div className='divide-y divide-gray-100'>
            {faqs.map((f, i) => (
              <div key={i} className='py-5'>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className='w-full flex items-center justify-between text-left gap-4 group'
                >
                  <span className={`font-semibold text-base transition-colors ${openFaq === i ? 'text-amber-600' : 'text-[#0B1F3B] group-hover:text-amber-600'}`}>
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-amber-500' : ''}`}
                  />
                </button>

                {openFaq === i && (
                  <p className='mt-3 text-gray-600 text-sm leading-relaxed pr-8'>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — dual split
          ═══════════════════════════════════════════════════════ */}
      <section className='grid md:grid-cols-2'>

        {/* Student CTA */}
        <div
          className='relative flex flex-col justify-end px-10 lg:px-14 py-20 min-h-[460px] overflow-hidden'
          style={{ backgroundImage: `url(${P.lecture})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-[#0B1F3B]/70 to-transparent' />
          <div className='relative z-10'>
            <GraduationCap size={36} className='text-amber-400 mb-4' />
            <h3 className='text-white font-black text-3xl leading-tight mb-3'>Ready to<br />make the move?</h3>
            <p className='text-gray-300 text-sm mb-6 max-w-xs'>Take the free IELTS diagnostic and see your personalised pathway in minutes.</p>
            <Link
              href='/eoi'
              className='inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:scale-105'
            >
              Start Free Diagnostic <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Partner CTA */}
        <div
          className='relative flex flex-col justify-end px-10 lg:px-14 py-20 min-h-[460px] overflow-hidden'
          style={{ backgroundImage: `url(${P.partner2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-[#030a15] via-[#030a15]/70 to-transparent' />
          <div className='relative z-10'>
            <HandshakeIcon size={36} className='text-amber-400 mb-4' />
            <h3 className='text-white font-black text-3xl leading-tight mb-3'>Grow your<br />agency with us.</h3>
            <p className='text-gray-300 text-sm mb-6 max-w-xs'>Accredited partners access a live candidate pipeline, a clean portal, and competitive commissions.</p>
            <Link
              href='/partner/apply'
              className='inline-flex items-center gap-2 border-2 border-white/60 hover:border-amber-400 hover:text-amber-400 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200'
            >
              Apply Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
