export default function Contact() {
    return (
      <section className="min-h-screen px-6 py-20 bg-black">
        <h2 className="text-4xl font-bold mb-8">Contact Me</h2>
        <form action="https://formsubmit.co/YOUR_EMAIL" method="POST" className="max-w-xl space-y-6">
          <input type="email" name="email" required placeholder="Your email" className="w-full p-3 bg-slate-800 rounded" />
          <input type="text" name="subject" placeholder="Subject" className="w-full p-3 bg-slate-800 rounded" />
          <textarea name="message" required rows={6} placeholder="Message" className="w-full p-3 bg-slate-800 rounded"></textarea>
          <button type="submit" className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-400 transition">
            Send
          </button>
        </form>
      </section>
    );
}
  