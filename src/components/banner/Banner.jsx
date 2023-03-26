import React from 'react'
import { Stack } from "@mui/material"

function Banner() {
    return (
        <section class="home" id="home">
            <div class="max-width">
                <div class="home-content">
                    <div class="icons">
                        <a href="https://github.com/muhammed-ijlan"><i class="fa-brands fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/ijlan/"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="https://twitter.com/muhammedijlan"><i class="fa-brands fa-twitter"></i></a>
                        <a>
                            <div onclick="window.open('mailto:ijlanijlu580@gmail.com');"> <i
                                class="fa-solid fa-envelope"></i></div>
                        </a>
                    </div>
                    <div class="text-1">Hello, my name is</div>
                    <div class="text-2">Ijlaaan</div>
                    <div class="text-3">And I'm a <span class="typing"></span></div>
                </div>

            </div>
        </section>
    )
}

export default Banner