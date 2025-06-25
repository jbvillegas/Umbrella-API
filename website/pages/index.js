import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import Documentation from '../components/Documentation'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Umbrella Weather API - Premium Weather Data for Developers</title>
        <meta name="description" content="Get reliable weather data with our premium API. Free tier available, premium features for serious applications." />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Hero />
        <Features />
        <Pricing />
        <Documentation />
        <Footer />
      </div>
    </>
  )
}
