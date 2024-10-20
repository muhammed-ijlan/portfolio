import React, { useRef } from 'react'
import Typed from 'react-typed'
import aboutBanner from "../../assets/banner1.png"
import aboutBanner2 from "../../assets/banner2.png"
import { Backdrop, Box, Button, Fade, Modal, TextField, Stack } from '@mui/material'
import myResume from "../../assets/ijlans-resume.pdf"

import emailjs from '@emailjs/browser';

import { toast } from 'react-toastify'
import axios from "axios";

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
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_KEY}/enquiry/`, {
                    name: values.user_name,
                    email: values.user_email,
                    subject: values.subject,
                    message: values.message,
                });

                // Handle API response
                if (!res.data.isError) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                    return;
                }
                await emailjs.sendForm(
                    'service_qieunjm',
                    'template_5cxi48t',
                    form.current,
                    'S8bWs21sBANc18V6_'
                );
                setTimeout(() => {
                    window.open(myResume)
                }, 2000);
                toast.success('Email has been sent!');
                resetForm();

            } catch (error) {
                console.log(error);
                toast.error('Something went wrong. Please try again later.');
            }
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
                        <img src={aboutBanner} alt="vector" />
                    </div>
                    <div class="column right">
                        <h1 class="text">I'm Muhammed Ijlan, I'm a <Typed
                            strings={["Web Developer"]}
                            typeSpeed={100}
                            backSpeed={100}
                        /></h1>
                        <p> As a <b>MERN Stack developer</b> based in Kerala, I bring over 2.5 years of experience in <b>front-end</b> and <b>back-end web development</b>. I specialize in building scalable web applications using <b>React.js, Node.js, and MongoDB</b>, ensuring high performance and responsiveness across devices. My work focuses on crafting user-centric interfaces and delivering robust server-side logic that helps businesses thrive online. <br /><br />
                            I have successfully completed numerous projects for various clients, delivering on time and within budget. My core strengths lie in <b>problem-solving</b>, software design, and development, backed by a solid understanding of modern technologies and industry best practices.

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
                <div class="about-content">


                    <div class="column right" style={{ marginTop: "30px" }}>
                        <h2 class="text">Experienced for <Typed
                            strings={["End-to-End Solutions"]}
                            typeSpeed={100}
                            backSpeed={100}
                            loop={false}
                        /> </h2>
                        <p> With a strong background in <b>JavaScript</b> and modern frameworks like <b>Next.js</b> and <b>Express.js</b>, I create seamless, efficient web solutions tailored to client needs. My expertise covers both <b>UI/UX design</b> and <b>back-end API development</b>, ensuring that the products I build not only look great but also function optimally.<br /><br />
                            I continually learn and adopt new tools, working with technologies like <b>AWS</b>, <b>Material UI</b>, and <b>GraphQL</b> to stay ahead in the industry. My goal is to deliver solutions that meet technical requirements and user expectations while maintaining high standards for code quality and performance.

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
                    <div class="column left" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" }
                            }}
                            component="img"
                            src={aboutBanner2}
                            alt="vector"
                        />
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