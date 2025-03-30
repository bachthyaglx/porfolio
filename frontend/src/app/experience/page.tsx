'use client';

import timelineData from "../../../public/data/timeline.json";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ExperiencePage() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      const experienceSection = document.getElementById('experience');
      const scrollY = window.scrollY;

      if (experienceSection && scrollY >= experienceSection.offsetTop - 200) {
        setActiveSection('experience');
      } else if (aboutSection && scrollY >= aboutSection.offsetTop - 200) {
        setActiveSection('about');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto flex flex-col desktop:flex-row gap-16">
        {/* Sidebar */}
        <aside className="desktop:w-[300px] w-full sticky top-24 h-max flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold">Thy</h1>
            <h2 className="text-lg text-slate-400">Fullstack Developer</h2>
            <p className="mt-4 text-sm text-slate-300">
              I'm a fullstack developer with a Computer Science degree. I’ve worked with top tech companies, and my focus now is building fast, accessible apps using modern tech.
            </p>
          </div>
  
          {/* Navigation — ẩn khi quá nhỏ */}
          <ul className="hidden desktop:block text-sm text-slate-500 space-y-2 uppercase tracking-wider">
            <li>
              <a
                href="#about"
                className={`block border-l-2 pl-4 transition ${activeSection === 'about' ? 'text-white border-white' : 'border-transparent hover:text-white hover:border-white'}`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#experience"
                className={`block border-l-2 pl-4 transition ${activeSection === 'experience' ? 'text-white border-white' : 'border-transparent hover:text-white hover:border-white'}`}
              >
                Experience
              </a>
            </li>
          </ul>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 space-y-16 scroll-smooth">
          <section id="about" className="scroll-mt-24">
            <p className="text-slate-300">
              I specialize in creating modern, performant, and accessible web applications using Next.js, React, and TypeScript.
              I love solving real-world problems and delivering elegant UI/UX.
            </p>
          </section>
  
          <section id="experience" className="scroll-mt-24">
            {timelineData.data.map((item, index) => (
              <Link
                href={item.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                key={`exp-${index}`}
                className="block max-w-3xl rounded-lg p-6 transition hover:bg-slate-700 hover:-translate-x-2 pr-50"
              >
                <p className="text-xs text-slate-400 mb-2">{item.year}</p>
                <h3 className="text-lg font-bold text-cyan-300">
                  {item.title} · {item.company} ↗
                </h3>
                <p className="text-sm text-slate-300 mt-2">{item.tasks}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag, i) => (
                    <span
                      key={`tag-${i}`}
                      className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
