/* eslint-disable @next/next/no-img-element */
import ContactBtn from "../navigation/ContactBtn";
import Image from "next/image";

const Service = ({ hl, desc, img }: { hl: string; desc: string; img: string }) => (
    <div className="flex min-h-full flex-col desktop:w-1/3 m-4 mobile:w-3/4 p-8 rounded-md transition-colors hover:bg-slate-700">
        <img className="w-2/3 h-auto self-center p-14" src={img} alt={hl} />
        <p className="text-xl font-bold">{hl}</p>
        <p className="mt-3 text-lg">{desc}</p>
    </div>
);

function Services() {
    return (
        <div id="Services" className="flex text-white min-h-full flex-col items-center bg-slate-800">
            <img
                src="/transitions/transition_gradient.svg"
                alt="transition"
                width="auto"
                height="auto"
                className="w-full h-44"
            />
            <p className="flex text-4xl my-8 justify-center text-white font-bold">Services</p>
            <div className="flex desktop:flex-row mobile:flex-col mobile:items-center flex-grow justify-around text-center">
                <Service hl="Single Page Applications" desc="Development of responsive web apps such as portfolios, landingpages and dashboards" img="/icons/spa.svg" />
                <Service hl="API Integration" desc="Seamless integration into your solution for dynamic content delivery" img="/icons/api.svg" />
                <Service hl="SEO Optimization" desc="Enhancing visibility and rankings of your web application" img="/icons/seo.svg" />
            </div>
            <p className="desktop:text-[40px] mobile:text-[24px] font-bold text-center mb-4">You have a project? Get in Touch</p>
            <ContactBtn title={"Contact Me"} />
        </div>
    )
}

export default Services;