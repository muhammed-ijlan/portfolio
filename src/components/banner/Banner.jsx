import React from 'react'
import { Box, Stack } from "@mui/material"
import Typed from "react-typed"
import programmer from "../../assets/programmer.png"
import { GitHub, LinkedIn, Twitter, Mail } from '@mui/icons-material'

function Banner() {
    const socialOpenHandler = (social) => {
        if (social === "github") {
            window.open("https://github.com/muhammed-ijlan")
        } else if (social === "linkedin") {
            window.open("https://www.linkedin.com/in/ijlan/")
        } else if (social === "twitter") {
            window.open("https://twitter.com/muhammedijlan")
        } else if (social === "mail") {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
    return (
        <section class="home" id="home">
            <div class="max-width">
                <Stack direction={{ xs: "column", sm: "column", md: "row" }} justifyContent={"space-between"} alignItems="center" width={"100%"}>

                    <div class="home-content" style={{ width: "100%" }}>
                        <div class="icons">
                            <GitHub onClick={() => socialOpenHandler("github")} />
                            <LinkedIn onClick={() => socialOpenHandler("linkedin")} />
                            <Twitter onClick={() => socialOpenHandler("twitter")} />
                            <Mail onClick={() => socialOpenHandler("mail")} />

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