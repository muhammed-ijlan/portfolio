import React from 'react'
import splashWash from '../../assets/splashhome.png'
function Projects() {
    return (
        <section class="teams" id="teams">
            <div class="max-width">
                <h2 class="title">Projects</h2>
                <div class="container">

                    <div class="card">
                        <a href="https://splashwash.in">

                            <div class="text">SplashWash - NodeJS</div>
                            <div class="image" style={{
                                background: `url(${splashWash})`, backgroundRepeat: "no-repeat",
                                backgroundSize: "100%"
                            }}>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects