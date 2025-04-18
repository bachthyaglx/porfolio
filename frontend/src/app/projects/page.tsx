// src/app/projects/page.tsx
'use client';

import Link from 'next/link';

export default function ProjectsPage() {
  const categories = [
    {
      title: 'Web Development',
      desc: 'Full-stack web development using React, Node.js, and more.',
      img: '/icons/spa.svg',
      href: '/projects/web-development',
    },
    {
      title: 'Data Science',
      desc: 'Machine Learning, Big Data, and AI.',
      img: '/icons/api.svg',
      href: '/projects/data-science',
    },
    {
      title: 'Embedded Systems',
      desc: 'Development of embedded systems and IoT devices.',
      img: '/icons/seo.svg',
      href: '/projects/embedded-systems',
    },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 pl-4">Project Categories</h1>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="w-60 aspect-square bg-slate-700 hover:bg-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center transition duration-300 group"
            >
              <img
                src={c.img}
                alt={c.title}
                className="h-16 mb-4 group-hover:scale-105 transition"
              />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition">
                {c.title}
              </h3>
              <p className="text-sm text-slate-300">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
