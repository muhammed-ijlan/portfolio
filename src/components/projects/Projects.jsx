import React from 'react';
import project from '../../assets/project-1.png';

import './Projects.css';
import { Stack } from '@mui/material';
import Project from './Project';

function Projects() {



    return (
        <section id="projects">
            <p class="section__text__p1">Browse My Recent</p>
            <h1 class="title">Projects</h1>
            <div class="experience-details-container">
                <div class="about-containers">
                    <Project />
                    <Project />
                    <Project />
                    <Project />
                </div>
                <Stack marginTop={3} alignItems={"center"} justifyContent={"center"}>
                    <button
                        style={{ width: "250px", display: 'flex', alignItems: 'center', justifyContent: "center", gap: "6px" }}
                        class="btn btn-color-2 project-btn"
                        onclick="location.href='https://github.com/'"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="currentColor" d="M6.25 4.5A1.75 1.75 0 0 0 4.5 6.25v7.5c0 .966.784 1.75 1.75 1.75h7.5a1.75 1.75 0 0 0 1.75-1.75v-2a.75.75 0 0 1 1.5 0v2A3.25 3.25 0 0 1 13.75 17h-7.5A3.25 3.25 0 0 1 3 13.75v-7.5A3.25 3.25 0 0 1 6.25 3h2a.75.75 0 0 1 0 1.5zm4.25-.75a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V5.56l-3.72 3.72a.75.75 0 1 1-1.06-1.06l3.72-3.72h-3.19a.75.75 0 0 1-.75-.75" /></svg>   View More
                    </button>
                </Stack>
            </div>
        </section>
    );
}

export default Projects;
