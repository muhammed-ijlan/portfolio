import React, { useRef } from 'react'
import Typed from 'react-typed'
import aboutBanner from "../../assets/banner-image.png"
import { Backdrop, Box, Button, Fade, Modal, TextField, Stack } from '@mui/material'
import myResume from "../../assets/ijlans-resume.pdf"

import emailjs from '@emailjs/browser';

import { toast } from 'react-toastify'

import { useFormik } from 'formik';
import * as Yup from 'yup';

import useResponsive from '../../utils/useResponsive'

const validationSchema = Yup.object().shape({
    user_name: Yup.string()
        .required('Name is required'),
    user_email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    subject: Yup.string()
        .required('Subject is required'),
    message: Yup.string()
        .required('Message is required'),
});

function About() {
    const [open, setOpen] = React.useState(false);
    const form = useRef();

    const formik = useFormik({
        initialValues: {
            user_name: '',
            user_email: '',
            subject: '',
            message: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            emailjs.sendForm('service_qieunjm', 'template_5cxi48t', form.current, 'S8bWs21sBANc18V6_')
                .then((result) => {
                    setOpen(false);
                    toast.success('Email has been sent !');
                    setTimeout(() => {
                        window.open(myResume)
                    }, 2000);
                    resetForm();
                }, (error) => {
                    toast.error('Email is not sent !');
                    console.log(error)
                });
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const smUp = useResponsive("down", "sm")
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: smUp ? "350px" : "400px ",
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };
    return (
        <section class="about" id="about">
            <div class="max-width ">
                <h2 class="title">About me</h2>
                <div class="about-content">

                    <div class="column left">
                        <img src={aboutBanner} alt="" />
                    </div>
                    <div class="column right">
                        <div class="text">I'm Ijlan and I'm a <Typed
                            strings={["Web Designer", "Web Developer"]}
                            typeSpeed={100}
                            backSpeed={100}
                            backDelay={1}
                            loop
                            smartBackspace
                        /></div>
                        <p>As an experienced Javascript developer with expertise in both Front-end and Back-end web development using the MERN Stack, I have spent several years building high-quality software solutions for various clients. I have gained extensive knowledge in software design, development, and testing, and have a strong track record of delivering projects on time and within budget. <br /> <br />
                            Throughout my career, I have worked with various technologies and frameworks, and I am always eager to learn new ones to stay up-to-date with the latest trends in the industry. My experience has also helped me develop strong problem-solving skills, and I am confident in my ability to tackle complex technical challenges.
                        </p>

                        <Button onClick={handleOpen} sx={{
                            width: "125px",
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
                        }}> Hire Me</Button>
                    </div>
                </div>
            </div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <form ref={form} className="contact-form" onSubmit={formik.handleSubmit}>
                            <Stack gap={1}>
                                <TextField label={"Your Name"} name={"user_name"} fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.user_name}
                                    error={formik.touched.user_name && Boolean(formik.errors.user_name)}
                                    helperText={formik.touched.user_name && formik.errors.user_name}
                                />
                                <TextField label={"Your Email"} name={"user_email"} fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.user_email}
                                    error={formik.touched.user_email && Boolean(formik.errors.user_email)}
                                    helperText={formik.touched.user_email && formik.errors.user_email}
                                />
                                <TextField label={"Subject"} name={"subject"} fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.subject}
                                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                                    helperText={formik.touched.subject && formik.errors.subject}
                                />
                                <TextField placeholder='Message' name={"message"} fullWidth minRows={2} multiline
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.message}
                                    error={formik.touched.message && Boolean(formik.errors.message)}
                                    helperText={formik.touched.message && formik.errors.message}
                                />
                                <Button type='submit' sx={{
                                    width: "100%",
                                    backgroundColor: "#242f9b",
                                    height: "43px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "white",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        backgroundColor: "#242f9b",
                                    }
                                }}> Download Resume</Button>
                            </Stack>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </section>
    )
}

export default About