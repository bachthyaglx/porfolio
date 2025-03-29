/* eslint-disable @next/next/no-img-element */
'use client';

import Typing from '@/components/ui/Typing';
import SocialMedia from '@/components/ui/SocialMedia';
import timelineData from "../../public/data/timeline.json"
import Link from 'next/link';

export default function Home() {
  return (
    <>
    {/* Greetings and Image */}
      <div className="flex items-center flex-col min-h-screen desktop:px-20 mobile:p-6 bg-gradient-to-r from-gradientLeft to-gradientRight">
        
        <div className="flex mobile:justify-center desktop:flex-row desktop:items-center mobile:flex-col items-center w-full flex-1">
          
          <div className="flex flex-col z-20 pointer-events-none text-white desktop:w-3/5 mobile:w-full mobile:text-center">
            <p className="desktop:text-[5vw] mobile:text-[8vw] font-bold text-lightcyan w-full ">
              Greetings, I&apos;m Thy
            </p>
            <p className="desktop:text-[3vw] mobile:text-[5vw]">A developer specializing in web applications with&nbsp;
              <Typing />
            </p>
            <div className='flex mobile:hidden mt-6 justify-start w-[17vw]'>
              <SocialMedia size={200} />
            </div>
          </div>

          <img
            className="w-2/5 mobile:w-full mobile:max-w-xl object-contain self-center animate-scalepulse" 
            src="/portraitdummy.webp" 
            alt="Portrait" 
          />
          
        </div>

      </div>
      
      {/* Footer */}
      <div className="bg-gradient-to-r from-gradientLeft to-gradientRight">
        <img className="w-full h-44" src="/transitions/transition_grey.svg" alt="transition" />
        <footer className="flex flex-col items-center">
            {/* <div className="pt-5">
                <SocialMedia size={35} />
            </div> */}
            <div className="flex text-white text-center p-5">&copy; {new Date().getFullYear()} All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}
