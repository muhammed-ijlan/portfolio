import React from 'react'
import project from '../../assets/project-1.png';

function Project() {
    return (
        <div class="details-container color-container">
            <div class="article-container">
                <img
                    src={project}
                    alt="Project 1"
                    class="project-img"
                />
            </div>
            <h2 class="experience-sub-title project-title">Project One</h2>
            <div class="btn-container">

                <button
                    class="btn btn-color-2 project-btn"
                    onclick="location.href='https://github.com/'"
                >
                    Live Demo
                </button>
            </div>
        </div>
    )
}

export default Project