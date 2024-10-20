import React, { useRef } from 'react'
import emailjs from '@emailjs/browser';

import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import axios from "axios";

import { useFormik } from 'formik';
import * as Yup from 'yup';

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
function Contact() {
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
                toast.success('Email has been sent!');
                resetForm();

            } catch (error) {
                console.log(error);
                toast.error('Something went wrong. Please try again later.');
            }
        },
    });


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
                        <form ref={form} className="contact-form" onSubmit={formik.handleSubmit}>
                            <div className="fields">
                                <div className="field name">
                                    <input
                                        type="text"
                                        name="user_name"
                                        placeholder="Name"
                                        value={formik.values.user_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.user_name && formik.errors.user_name ? (
                                        <div className="error">{formik.errors.user_name}</div>
                                    ) : null}
                                </div>
                                <div className="field email">
                                    <input
                                        type="email"
                                        name="user_email"
                                        placeholder="Email"
                                        value={formik.values.user_email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.user_email && formik.errors.user_email ? (
                                        <div className="error">{formik.errors.user_email}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.subject && formik.errors.subject ? (
                                    <div className="error">{formik.errors.subject}</div>
                                ) : null}
                            </div>
                            <div className="field textarea">
                                <textarea
                                    cols="30"
                                    rows="10"
                                    name="message"
                                    placeholder="Message.."
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.message && formik.errors.message ? (
                                    <div className="error">{formik.errors.message}</div>
                                ) : null}
                            </div>
                            <Button
                                type="submit"
                                sx={{
                                    width: '155px',
                                    backgroundColor: '#242f9b',
                                    height: '43px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: 'white',
                                    textTransform: 'capitalize',
                                    m: '20px 0',
                                    '&:hover': {
                                        backgroundColor: '#242f9b',
                                    },
                                }}
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact