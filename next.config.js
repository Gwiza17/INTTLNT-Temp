/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-project.supabase.co'], // Replace with your Supabase storage domain
  },
}

module.exports = nextConfig
