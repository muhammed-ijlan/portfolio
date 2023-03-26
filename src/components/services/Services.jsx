import React from 'react'

function Services() {
    return (
        <section class="services" id="services">
            <div class="max-width">
                <h2 class="title">My services</h2>
                <div class="serv-content">
                    <div class="card">
                        <div class="box">
                            <i class="fas fa-chart-line"></i>
                            <div class="text">Front-end Development</div>

                        </div>
                    </div>
                    <div class="card">
                        <div class="box">
                            <i class="fas fa-paint-brush"></i>

                            <div class="text">Web Design</div>

                        </div>
                    </div>
                    <div class="card">
                        <div class="box">
                            <i class="fas fa-code"></i>
                            <div class="text">Backend Development</div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services