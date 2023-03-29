import { useEffect, useRef, useState } from 'react'
import "../../index.css"

// ======================== IMPORTS ENDS HERE ==========================//


function Navbar() {
    const [isSticky, setIsSticky] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [isActive, setIsActive] = useState(false);

    function toggleMenu() {
        setIsActive(!isActive);
    }


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

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
                    <ul className={`menu ${isActive ? 'active' : ''}`}>
                        <li><a href="#home" class="menu-btn" onClick={toggleMenu}>Home</a></li>
                        <li><a href="#about" class="menu-btn" onClick={toggleMenu}>About</a></li>
                        <li><a href="#services" class="menu-btn" onClick={toggleMenu}>Services</a></li>
                        <li><a href="#skills" class="menu-btn" onClick={toggleMenu}>Skills</a></li>
                        <li><a href="#teams" class="menu-btn" onClick={toggleMenu}>Projects</a></li>
                        <li><a href="#contact" class="menu-btn" onClick={toggleMenu}>Contact</a></li>
                    </ul>
                    <div className="menu-btn" onClick={toggleMenu}>
                        <i className={`fas fa-bars ${isActive ? 'active' : ''}`}></i>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;