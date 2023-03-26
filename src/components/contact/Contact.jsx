import React from 'react'
import { Button } from '@mui/material'
function Contact() {
    return (
        <section class="contact" id="contact">
            <div class="max-width">
                <h2 class="title">Contact me</h2>
                <div class="contact-content">
                    <div class="column left">
                        <div class="text">Get in Touch</div>
                        <div class="icons">
                            <div class="row">
                                <i class="fas fa-user"></i>
                                <div class="info">
                                    <div class="head">Name</div>
                                    <div class="sub-title">Muhammed Ijlan</div>
                                </div>
                            </div>
                            <div class="row">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="info">
                                    <div class="head">Address</div>
                                    <div class="sub-title">Kannur, Kerala, India</div>
                                </div>
                            </div>
                            <div class="row">
                                <i class="fas fa-envelope"></i>
                                <div class="info">
                                    <div class="head">Email</div>
                                    <div class="sub-title">ijlan.dev@gmail.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column right">
                        <div class="text">Message me</div>
                        <form class="contact-form">
                            <div class="fields">
                                <div class="field name">
                                    <input type="text" name="name" placeholder="Name" required />
                                </div>
                                <div class="field email">
                                    <input type="email" name="email" placeholder="Email" required />
                                </div>
                            </div>
                            <div class="field">
                                <input type="text" id="subject" name="subject" placeholder="Subject" required />
                            </div>
                            <div class="field textarea">
                                <textarea cols="30" rows="10" name="message" placeholder="Message.." required></textarea>
                            </div>
                            {/* <div class="button-area"> */}
                            <Button sx={{
                                width: "155px",
                                backgroundColor: "#242f9b",
                                height: "43px",
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "white",
                                textTransform: "capitalize",
                                m: "20px 0",
                                "&:hover": {
                                    backgroundColor: "#242f9b",
                                }
                            }}>Send Message</Button>
                            {/* </div> */}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact