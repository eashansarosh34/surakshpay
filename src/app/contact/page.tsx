import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-12 text-center">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h3>
            <div className="space-y-6 text-slate-600">
              <div>
                <strong className="block text-slate-900">Email</strong>
                <a href="mailto:eashansarosh@gmail.com" className="text-blue-600 hover:underline">eashansarosh@gmail.com</a>
              </div>
              <div>
                <strong className="block text-slate-900">Phone</strong>
                <p>+91 98765 43210</p>
              </div>
              <div>
                <strong className="block text-slate-900">Address</strong>
                <p>Bhadradri Kothagudem<br/>Telangana, India</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full border border-slate-300 rounded-lg p-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full border border-slate-300 rounded-lg p-2.5"></textarea>
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}