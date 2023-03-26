import React from 'react'

import aboutBanner from "../../assets/banner-image.png"

function About() {
    return (
        <section class="about" id="about">
            <div class="max-width ">
                <h2 class="title">About me</h2>
                <div class="about-content">

                    <div class="column left">
                        <img src={aboutBanner} alt="" />
                    </div>
                    <div class="column right">
                        <div class="text">I'm Ijlan and I'm a <span class="typing-2"></span></div>
                        <p>A Computer Application graduate with expertise in programming and coding skills, seeking a
                            profession as a
                            programmer in a reputed IT company, to grow with the company where I can effectively contribute
                            my
                            software skills as professional, and am always curious to know about all the technical aspects
                            that make
                            revolutionary changes in our day-to-day life.</p>
                        <a class="modal-btn">Hire Me</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About