import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart Invoice Management <br/><span className="text-blue-600">for B2B Businesses.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Generate professional invoices, track payments, and streamline high-value collections for your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/pricing" className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
            <Link href="/contact" className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-slate-50 transition-colors">
              Request a Demo
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create an invoice</h3>
                <p className="text-slate-600">Generate a beautiful, GST-compliant invoice in seconds.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Share with customer</h3>
                <p className="text-slate-600">Send the invoice directly to your B2B clients securely.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Track payments</h3>
                <p className="text-slate-600">Monitor payment status in real-time on your dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}