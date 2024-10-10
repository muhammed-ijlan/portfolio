import React from 'react'
import { Stack, Box } from "@mui/material"
import mern from "../../assets/mern.png"

function Skills() {
    return (
        <section class="skills" id="skills">
            <div class="max-width">
                <h2 class="title">My skills</h2>
                <div class="skills-content">
                    <div class="column left">
                        <div class="text">My creative skills & experiences.</div>
                        <p>As an experienced full stack developer, I have gained extensive knowledge and proficiency in utilizing a range of cutting-edge technologies and frameworks to build high-quality software solutions. I specialize in the MERN stack, with a deep understanding of ReactJS for front-end development, NodeJS for back-end development, and MongoDB for database management. <br /> <br />

                            Over the years, I have worked on a wide range of projects, from small-scale web applications to complex enterprise-level systems. My experience has helped me develop strong problem-solving skills and the ability to identify and address technical challenges efficiently.</p>

                    </div>
                    <div class="column right">
                        <Stack>
                            <Box component={"img"} src={mern} />
                        </Stack>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills