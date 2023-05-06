import React from 'react'
import About from '../components/about/About'
import Banner from '../components/banner/Banner'
import Contact from '../components/contact/Contact'
import Footer from '../components/footer/Footer'
import Projects from '../components/projects/Projects'
import Services from '../components/services/Services'
import Skills from '../components/skills/Skills'

function HomePage() {
    return (
        <body>
            <Banner />

            <About />

            <Services />
            <Skills />



            <Projects />
            <Contact />
            <Footer />
        </body>
    )
}

export default HomePage