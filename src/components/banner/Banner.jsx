import React from 'react'
import { Box, Stack } from "@mui/material"
import Typed from "react-typed"
import programmer from "../../assets/programmer.png"
import { GitHub, LinkedIn, Twitter, Mail } from '@mui/icons-material'

function Banner() {
    return (
        <section class="home" id="home">
            <div class="max-width">
                <Stack direction={{ xs: "column", sm: "column", md: "row" }} justifyContent={"space-between"} alignItems="center" width={"100%"}>

                    <div class="home-content" style={{ width: "100%" }}>
                        <div class="icons">
                            <GitHub />
                            <LinkedIn />
                            <Twitter />
                            <Mail />
                            {/* <a href="https://github.com/muhammed-ijlan"><i class="fa-brands fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/ijlan/"><i class="fa-brands fa-linkedin"></i></a>
                            <a href="https://twitter.com/muhammedijlan"><i class="fa-brands fa-twitter"></i></a> */}
                            {/* <a>
                                <div onclick="window.open('mailto:ijlanijlu580@gmail.com');"> <i
                                    class="fa-solid fa-envelope"></i></div>
                            </a> */}
                        </div>
                        <div class="text-1">Hello, my name is</div>
                        <div class="text-2">Ijlaaan</div>
                        <Box component={"img"} src={programmer} maxWidth={"400px"} display={{ xs: "none", sm: "flex", md: "none" }} />
                        <div class="text-3">And I'm a   <Typed
                            strings={["Web Designer", "Web Developer"]}
                            typeSpeed={100}
                            backSpeed={100}
                            backDelay={1}
                            loop
                            smartBackspace
                        /></div>
                    </div>

                    <Box component={"img"} src={programmer} maxWidth={{ lg: "450px", md: "400px" }} display={{ xs: "none", md: "flex" }} />
                </Stack>
            </div>
        </section>
    )
}

export default Banner