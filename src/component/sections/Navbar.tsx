'use client'

import useScrollPos from "@/hooks/useScrollPos";
import ContactBtn from "../navigation/ContactBtn";

function Navbar() {
    const isAtTop = useScrollPos();

    return (
        <div className={`mobile:hidden sticky -mt-14 top-0 z-50 transition-opacity duration-500 ${isAtTop ? 'opacity-100' : 'opacity-0 hover:opacity-100'} flex justify-end items-center h-14 w-full bg-gradient-to-r from-transparent to-black text-white`} >
            <div className="flex justify-around text-2xl w-1/2 items-center">
                <a href="#About" className="text-white hover:text-gray-300">About</a>
                <a href="#Projects" className="text-white hover:text-gray-300">Projects</a>
                <a href="#Services" className="text-white hover:text-gray-300">Services</a>
                <ContactBtn title={"Contact"} />
            </div>
        </div>
    );
}

export default Navbar;