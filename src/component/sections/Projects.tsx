/* eslint-disable @next/next/no-img-element */
import projectData from "@/../public/data/projects.json";
import Tag from "@/ui/Tag";

function Projects() {
    return (
        <div id="Projects" className="bg-gradient-to-r from-gradientLeft to-gradientRight">
            <img 
                src="/transitions/transition_gradient.svg" 
                alt="transition" 
                className="w-full h-44" 
                width="auto"
                height="auto"
            />
            <p className="flex text-4xl my-8 justify-center text-white font-bold">
                Featured Projects
            </p>
            <div className="flex flex-wrap w-full desktop:px-20 justify-center">
                {projectData.data.map((item, index) => (
                    <a href={item.link} key={index} className="flex flex-col transition-all hover:scale-105 scale-100 bg-opacity-20 bg-black rounded-lg max-h-max max-w-96 m-3 text-white">
                        <img 
                            className="w-fit h-fit rounded-t-lg max-h-64" 
                            alt={item.text} 
                            src={item.image} 
                        />
                        <div className="p-4">
                            <div className="text-xl font-medium mb-4">{item.title}</div>
                            <p>{item.text}</p>
                            <ul className="mt-2 flex flex-wrap">
                                {item.tags.map((tag, i) => (
                                    <li key={i} className="mr-1.5 mt-2">
                                        <Tag title={tag} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Projects;
