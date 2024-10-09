import React from 'react'
import project from '../../assets/project-1.png';

function Project({ data }) {
    return (
        <div class="details-container color-container">
            <div class="article-container"

            >
                <img
                    src={data?.images && import.meta.env.VITE_API_KEY + data.images[0]}
                    alt="Project"
                    class="project-img"
                    width={"300px"}
                    height={"400px"}
                />
            </div>
            <h2 class="experience-sub-title project-title">{data?.projectName}</h2>
            <div class="btn-container">

                <button
                    class="btn btn-color-2 project-btn"
                    onClick={() => window.open(data?.projectLink)}
                >
                    Live Demo
                </button>
            </div>
        </div>
    )
}

export default Project