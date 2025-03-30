'use client';

import timelineData from "../../../public/data/timeline.json";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function ExperiencePage() {
  const [activeSection, setActiveSection] = useState('about');
  const disableScrollRef = useRef(false); // ⛔ tạm tắt scroll tracking khi click nav

  useEffect(() => {
    const handleScroll = () => {
      if (disableScrollRef.current) return;

      const aboutSection = document.getElementById('about');
      const experienceSection = document.getElementById('experience');
      const scrollY = window.scrollY;

      if (experienceSection && scrollY >= experienceSection.offsetTop - 300) {
        setActiveSection('experience');
      } else if (aboutSection && scrollY >= aboutSection.offsetTop - 300) {
        setActiveSection('about');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Scroll to section + set active
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    disableScrollRef.current = true;

    setTimeout(() => {
      disableScrollRef.current = false;
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto flex flex-col desktop:flex-row gap-16">
        {/* Sidebar */}
        <aside className="desktop:w-[300px] w-full desktop:sticky top-24 h-max flex flex-col gap-8 z-10 bg-slate-900">
          <div>
            <h1 className="text-4xl font-bold">Thy</h1>
            <h2 className="text-lg text-slate-400">Fullstack Developer</h2>
            <p className="mt-4 text-sm text-slate-300">
              I'm a fullstack developer with a Computer Science degree. I’ve worked with top tech companies, and my focus now is building fast, accessible apps using modern tech.
            </p>
          </div>

          {/* Navigation */}
          <ul className="hidden desktop:block text-sm text-slate-500 space-y-4 uppercase tracking-wider">
            <li className="flex items-center gap-4">
              <span className="h-px w-6 bg-slate-500"></span>
              <button
                onClick={() => scrollTo('about')}
                className={`transition font-semibold text-left ${
                  activeSection === 'about'
                    ? 'text-white'
                    : 'hover:text-white text-slate-500'
                }`}
              >
                About
              </button>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-px w-6 bg-slate-500"></span>
              <button
                onClick={() => scrollTo('experience')}
                className={`transition font-semibold text-left ${
                  activeSection === 'experience'
                    ? 'text-white'
                    : 'hover:text-white text-slate-500'
                }`}
              >
                Experience
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 scroll-smooth">
          <section id="about" className="scroll-mt-28 max-w-4xl mx-auto">
            <p className="text-slate-300">
              I’m a developer passionate about crafting accessible, pixel-perfect user interfaces that blend thoughtful design with robust engineering. My favorite work lies at the intersection of design and development, creating experiences that not only look great but are meticulously built for performance and usability.
            </p><br/>
            <p className="text-slate-300">      
              Currently, I'm a Senior Front-End Engineer at Klaviyo, specializing in accessibility. I contribute to the creation and maintenance of UI components that power Klaviyo’s frontend, ensuring our platform meets web accessibility standards and best practices to deliver an inclusive user experience.
            </p><br/>
            <p className="text-slate-300">
              In the past, I've had the opportunity to develop software across a variety of settings — from advertising agencies and large corporations to start-ups and small digital product studios. Additionally, I also released a comprehensive video course a few years ago, guiding learners through building a web app with the Spotify API.
            </p><br/>
            <p className="text-slate-300">
              In my spare time, I’m usually climbing, reading, hanging out with my wife and two cats, or running around Hyrule searching for Korok seeds.
            </p>
          </section>

          <section id="experience" className="scroll-mt-28 max-w-4xl mx-auto space-y-4 pt-10">
            {timelineData.data.map((item, index) => (
              <Link
                href={item.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                key={`exp-${index}`}
                className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-5"
              >
                <div className="flex items-start gap-6">
                  {/* Year column */}
                  <div className="pt-1 w-50 shrink-0 text-sm text-slate-400">
                    {item.year}
                  </div>

                  {/* Content column */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {item.title} @ {item.company} ↗
                    </h3>
                    <p className="text-slate-300 text-sm mt-2">{item.tasks}</p>
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
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
