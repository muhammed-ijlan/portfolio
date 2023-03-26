import React from 'react'

function Skills() {
    return (
        <section class="skills" id="skills">
            <div class="max-width">
                <h2 class="title">My skills</h2>
                <div class="skills-content">
                    <div class="column left">
                        <div class="text">My creative skills & experiences.</div>
                        <p>I was responsible for developing and managing web applications and websites. I used a variety of
                            programming languages and tools, including Angular, ReactJS, NodeJS, Express, and MongoDB. I
                            also worked closely with designers, content writers, and other team members to ensure that all
                            project requirements were met.</p>

                    </div>
                    <div class="column right">
                        <div class="bars">
                            <div class="info">
                                <span>ReactJS</span>
                                <span>70%</span>
                            </div>
                            <div class="line html"></div>
                        </div>
                        <div class="bars">
                            <div class="info">
                                <span>Angular</span>
                                <span>60%</span>
                            </div>
                            <div class="line css"></div>
                        </div>
                        <div class="bars">
                            <div class="info">
                                <span>JavaScript</span>
                                <span>80%</span>
                            </div>
                            <div class="line js"></div>
                        </div>
                        <div class="bars">
                            <div class="info">
                                <span>NodeJS</span>
                                <span>60%</span>
                            </div>
                            <div class="line php"></div>
                        </div>
                        <div class="bars">
                            <div class="info">
                                <span>MongoDB</span>
                                <span>60%</span>
                            </div>
                            <div class="line mysql"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills