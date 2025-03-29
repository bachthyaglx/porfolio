import projectData from '@/../public/data/projects.json';
import Tag from '@/components/ui/Tag';

export default function Projects() {
  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-r from-gray-900 to-black">
      <h2 className="text-4xl font-bold mb-10">Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectData.data.map((project, i) => (
          <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-6 rounded-lg hover:scale-105 transition transform">
            <img src={project.image} alt={project.title} className="rounded-md mb-4 w-full h-48 object-cover" />
            <h3 className="text-2xl font-semibold">{project.title}</h3>
            <p className="text-sm my-2">{project.text}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((tag, idx) => <Tag key={idx} title={tag} />)}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
