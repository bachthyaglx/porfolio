/* eslint-disable @next/next/no-img-element */
'use client'

import Arrow from "@/ui/Arrow";
import SocialMedia from "@/ui/SocialMedia";
import Typing from "@/ui/Typing";
import Link from "next/link";
import Image from "next/image";

function Greetings() {
    return (
        <div className="flex items-center flex-col min-h-screen desktop:px-20 mobile:p-6 bg-gradient-to-r from-gradientLeft to-gradientRight">

            <div className="flex mobile:justify-center desktop:flex-row desktop:items-center mobile:flex-col-reverse items-center w-full flex-1">
                <div className="flex flex-col z-20 pointer-events-none text-white desktop:w-3/5 mobile:w-full mobile:text-center">
                    <p className="desktop:text-[5vw] mobile:text-[8vw] font-bold text-lightcyan w-full">
                        Greetings, I&apos;m Thy
                    </p>
                    <p className="desktop:text-[3vw] mobile:text-[5vw]">
                        a developer specializing in web applications with&nbsp;<Typing />
                    </p>
                    <div className='flex mobile:hidden mt-6 justify-start w-[17vw]'>
                        <SocialMedia size={200} />
                    </div>
                </div>
                <Image 
                    className="w-2/5 mobile:w-full mobile:max-w-xl object-contain self-center animate-scalepulse" 
                    src="/portraitdummy.webp" 
                    alt="Portrait" 
                    width={800} 
                    height={176} 
                    priority={true} // Makes this image load faster (no lazy loading)
                />
            </div>

            <div className="desktop:absolute desktop:bottom-10 inset-0 flex items-end py-2 justify-center z-10">
                <Link href={"/#About"} aria-label='About' >
                    <Arrow />
                </Link>
            </div>

        </div>
    )
}

export default Greetings;