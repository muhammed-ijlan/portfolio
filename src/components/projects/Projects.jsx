import React from 'react';
import splashWash from '../../assets/splashhome.png';
import maqlink from '../../assets/maqlink.png';
import lambda from '../../assets/lambda.png';

import './Projects.css';
import { Grid } from '@mui/material';

function Projects() {

    const data = [
        {
            title: 'SplashWash',
            content:
                'This project is a website for booking and paying for vehicle washing services online. It is built using Node.js and EJS as the backend and templating engine. It also integrates with a payment gateway to process online payments securely. The website features a responsive design and user authentication.',
            image: splashWash,
        },
        {
            title: 'Maqlink',
            content:
                'This project aims to improve the website of Maqlink Consultancy by integrating a contact form, an admin panel for enquiries and news blogs management, and a chatbot functionality. The website is built using React JS, Material UI, NodeJS, and MongoDB. These additions will enhance the user experience and improve the company\'s ability to connect with potential clients, manage enquiries, and provide real-time support.',
            image: maqlink,
        },
        {
            title: 'Lambda Gaming',
            content:
                'This project is a gaming accessory e-commerce web application with an awesome UI, full-fledged functionalities, and a responsive design. It offers features such as product search, cart, payment, order tracking, invoice generation, and return management to provide gamers with a seamless shopping experience.',
            image: lambda,
        },
    ];

    return (
        <section class="teams" id="teams">
            <div class="max-width">
                <h2 class="title">Projects</h2>
                <div class="container" style={{ marginTop: '30px' }}>
                    {data.map((item, index) => (
                        <div className="projectCard" key={index}>
                            <img src={item.image} alt="" className="projectImage" />
                            <div className="projectContent">
                                <h2>{item.title}</h2>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
