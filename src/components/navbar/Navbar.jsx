import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../index.css";

// ======================== IMPORTS ENDS HERE ==========================//

function Navbar() {
    const [isSticky, setIsSticky] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleNavigate = (path) => {
        if (path === "/projects" || path === "/") {
            navigate(path);
        } else {
            if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                    scrollToSection(path);
                }, 100);
            } else {
                scrollToSection(path);
            }
        }
        setIsActive(false);
    };

    const scrollToSection = (id) => {
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isActiveRoute = (route) => location.pathname === route;

    return (
        <>
            {/*  -------------------------- WEB NAVBAR ------------------------  */}
            <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
                <div className="max-width">
                    <div className="logo">
                        <a href="/">Ijlan's<span> Portfolio.</span></a>
                    </div>
                    <ul className={`menu ${isActive ? 'active' : ''}`}>
                        <li>
                            <a
                                className={`menu-btn ${isActiveRoute('/') ? 'active-nav' : ''}`}
                                onClick={() => handleNavigate('/')}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                className={`menu-btn ${isActiveRoute('/projects') ? 'active-nav' : ''}`}
                                onClick={() => handleNavigate('/projects')}
                            >
                                Projects
                            </a>
                        </li>
                        <li>
                            <a
                                className="menu-btn"
                                onClick={() => handleNavigate('#about')}
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                className="menu-btn"
                                onClick={() => handleNavigate('#services')}
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                className="menu-btn"
                                onClick={() => handleNavigate('#skills')}
                            >
                                Skills
                            </a>
                        </li>
                        <li>
                            <a
                                className="menu-btn"
                                onClick={() => handleNavigate('#contact')}
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                    <div className="menu-btn" onClick={toggleMenu}>
                        <i className={`fas fa-bars ${isActive ? 'active' : ''}`}></i>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
