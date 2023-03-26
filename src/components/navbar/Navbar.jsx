import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Collapse, List, ListItemButton, ListItemText, Stack, Typography, Box, Drawer, Divider } from '@mui/material'
import { ArrowDropDown, Close, Menu, PlayArrow, ArrowDropUp, AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { makeStyles } from "@mui/styles"
import "./Navbar.css"

// ======================== IMPORTS ENDS HERE ==========================//

const useStyles = makeStyles({
    root: {
        background: "#2B52A4 !important",
        color: "white !important"
    }
})

function Navbar() {
    const [open, setOpen] = useState(false);
    const [openNested, setOpenNested] = useState([]);
    const [state, setState] = useState({
        left: false,
    });

    const classes = useStyles();

    const navRef = useRef();
    const navigate = useNavigate()
    const location = useLocation();

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };


    return (
        <>
            {/*  -------------------------- WEB NAVBAR ------------------------  */}
            <header>
                <a onClick={() => navigate("/")}>
                    Ijlan's <span> Portfolio.</span>
                </a>
                <button className="nav-btn" onClick={toggleDrawer("left", true)}>
                    <Menu />
                </button>
                <nav ref={navRef}>
                    <a className={location.pathname === '/' ? 'active' : ''} onClick={() => { navigate("/"); }}>Home</a>
                    <a className={location.pathname === '/aboutus' ? 'active' : ''} onClick={() => { navigate("/aboutus"); }}>About</a>

                    <a className={location.pathname === '/news' ? 'active' : ''} onClick={() => { navigate("/news"); }}>Services</a>
                    <a className={location.pathname === '/blogs' ? 'active' : ''} onClick={() => { navigate("/blogs"); }}>Skills</a>
                    <a className={location.pathname === '/contact' ? 'active' : ''} onClick={() => { navigate("/contact"); }}>Projects</a>
                    <a className={location.pathname === '/contact' ? 'active' : ''} onClick={() => { navigate("/contact"); }}>Contact</a>
                    <button
                        className="nav-btn nav-close-btn"
                        onClick={toggleDrawer("left", true)}
                    >
                        <Close />
                    </button>
                </nav>
            </header>
            <div>
            </div>
        </>
    )
}

export default Navbar;