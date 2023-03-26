import { useEffect, useRef, useState } from 'react'
import "../../index.css"

// ======================== IMPORTS ENDS HERE ==========================//


function Navbar() {
    const [isSticky, setIsSticky] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // sticky navbar on scroll script
            if (window.scrollY > 20) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // scroll-up button show/hide script
            if (window.scrollY > 500) {
                setShowScrollBtn(true);
            } else {
                setShowScrollBtn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            {/*  -------------------------- WEB NAVBAR ------------------------  */}
            <nav class={`navbar ${isSticky ? 'sticky' : ''}`}>
                <div class="max-width">
                    <div class="logo"><a href="#">Ijlan's<span> Portfolio.</span></a></div>
                    <ul class="menu">
                        <li><a href="#home" class="menu-btn">Home</a></li>
                        <li><a href="#about" class="menu-btn">About</a></li>
                        <li><a href="#services" class="menu-btn">Services</a></li>
                        <li><a href="#skills" class="menu-btn">Skills</a></li>
                        <li><a href="#teams" class="menu-btn">Projects</a></li>
                        <li><a href="#contact" class="menu-btn">Contact</a></li>
                    </ul>
                    <div class="menu-btn">
                        <i class="fas fa-bars"></i>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;