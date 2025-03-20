/* eslint-disable @next/next/no-img-element */
import Timeline from "@/ui/Timeline";

function About() {
    return (
        <div className="bg-slate-800" id="About">
            <img 
                src="/transitions/transition_gradient.svg" 
                alt="transition" 
                className="w-full h-44" 
                width="auto"
                height="auto"
            />
            <div className="flex justify-center items-center text-white">
                <div className="flex flex-row w-full">
                    <div className="flex desktop:w-1/2 mobile:w-full mobile:p-4 flex-col desktop:p-20">
                        <p className="text-4xl mb-8">About me</p>
                        <article className="desktop:text-xl mobile:text-md">
                            <p className="mb-5">
                                My name is Thy Khuu. I am a graduating master&apos;s student in Data Science 🎓, previously
                                in Information Technology and Software Engineering. With 5+ years of engineering experience, 
                                including the last 2+ years in software development focused on building scalable, performance, 
                                and accessibility web applications. I am eager to learn newtechnologies and hungry for a new adventure. 
                                I am seeking a long-term opportunity to contribute toimpactful software solutions while advancing my 
                                career in software development.
                            </p>
                        </article>
                    </div>
                    <div className="desktop:flex mobile:hidden w-1/2 flex-col pl-10">
                        <Timeline />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
