export default function Services() {
    const services = [
      {
        title: "Single Page Applications",
        desc: "Development of responsive web apps like portfolios, dashboards.",
        img: "/icons/spa.svg",
      },
      {
        title: "API Integration",
        desc: "Seamless integration with 3rd party APIs and services.",
        img: "/icons/api.svg",
      },
      {
        title: "SEO Optimization",
        desc: "Optimizing performance and visibility for search engines.",
        img: "/icons/seo.svg",
      },
    ];
  
    return (
      <section className="min-h-screen px-6 py-20 bg-slate-800">
        <h2 className="text-4xl font-bold mb-12">Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-700 p-6 rounded-lg text-center hover:bg-slate-600 transition">
              <img src={s.img} alt={s.title} className="mx-auto mb-4 h-24" />
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
}
  