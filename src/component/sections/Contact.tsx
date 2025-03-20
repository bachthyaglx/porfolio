'use client'

import Form from "@/ui/Form";
import { useGlobalState } from "@/contexts/GlobalStateContext";

function Contact() {
    const { isModalOpen, exitModal } = useGlobalState();

    return (
        <>
            {isModalOpen && (
                <>
                    <div className="fixed top-0 right-0 p-2 z-[101]" onClick={exitModal}>
                        <button className="relative z-50 p-6 bg-opacity-50 rounded-md bg-slate-200">
                            <div className="w-8 h-1 rotate-45 -translate-x-1/2 absolute bg-white animate-pulse"></div>
                            <div className="w-8 h-1 -rotate-45 -translate-x-1/2 absolute bg-white animate-pulse"></div>
                        </button>
                    </div>
                    <div className="fixed text-white text-4xl bg-black backdrop-blur-md bg-opacity-40 w-full h-screen min-h-screen z-[100]">
                        <Form />
                    </div>
                </>
            )}
        </>
    );
}

export default Contact;