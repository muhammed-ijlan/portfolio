import React, { useEffect, useState } from 'react'
import project from '../assets/project-1.png';
import { Grid, Pagination, Stack } from '@mui/material';
import Project from '../components/projects/Project';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        background: 'white',
        width: '100%',
        height: 65,
        [theme.breakpoints.down('sm')]: {
            height: 50,
        },
        borderRadius: '25px',
        justifyContent: 'space-between',
        paddingLeft: '15px',
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    },
    textField: {
        width: '100%',
        color: 'black',
        '& .MuiInputBase-input': {
            fontSize: '15px',
            color: 'black',
        },
        '& .MuiInputBase-input::placeholder': {
            color: 'black',
        },
    },
    submitButton: {
        width: '22px',
        height: '100%',
        color: 'white',
        background: theme.palette.primary.main,
        borderRadius: '0 25px 25px 0 !important',
    },
    formControl: {
        minWidth: 174,
        height: 40,
        background: '#FFFFFF',
        borderRadius: 8,
        color: 'black',
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"

    },
    iconButton: {
        padding: 8,
    },
    inputBase: {
        fontSize: '15px !important',
        background: 'white',
        borderRadius: 8,
        color: "black !important",
        paddingLeft: 10,
        paddingTop: 10,
    },
    label: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center !important',
        fontSize: '15px !important',
        '&:focus': {
            color: "#242f9b"
        }
    },
    icon: {
        marginRight: theme.spacing(1),
        fontSize: "15px !important"
        // paddingTop: "5px !important",
    },
    menuItem: {
        fontSize: '14px !important',
        color: 'black',
        '&:hover': {
            backgroundColor: '#F2F2F2',
        },
    },
    menuPaper: {
        borderRadius: '8px',
        marginTop: '8px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    },
    inputLabelRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontSize: '15px',
    },
    inputLabelShrink: {
        transform: 'translate(12px, 10px) scale(0.75)',
        color: 'black',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '50px 0 50px 0 ',
    },
    pagination: {
        '& .MuiPaginationItem-root': {
            fontSize: '15px',
            color: 'black',
        },
        '& .Mui-selected': {
            color: 'white',
            backgroundColor: "#242f9b",
        },
    },
}));

function ProjectsPage() {
    const classes = useStyles();

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [maxRecords, setMaxRecords] = useState(0);


    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const fetchAllProjects = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_KEY}/project/public/all?size=${rowsPerPage}&page=${page > 0 ? page - 1 : page}`);
            setProjects(res.data.data.projects)
            setMaxRecords(Math.ceil(res.data.data.maxRecords / rowsPerPage))
        } catch (e) {
            console.log(e.response?.data.message)
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, [page, rowsPerPage])


    return (
        <div style={{ paddingTop: "100px" }}>
            <section id="projects">
                <p class="section__text__p1">Browse All My</p>
                <h1 class="title">Projects Done</h1>
                <div class="experience-details-container">
                    <div class="about-containers">


                        <Grid container rowGap={8} columnSpacing={8}>
                            {
                                projects?.map((item) => (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Project data={item} />
                                    </Grid>
                                ))
                            }
                        </Grid>

                    </div>
                    <Stack alignItems={"center"} justifyContent={"center"}>
                        <div className={classes.paginationContainer}>
                            <Pagination size='large' count={maxRecords} color={"primary"} page={page} onChange={(e, newPage) => setPage(newPage)} classes={{ ul: classes.pagination }} />
                        </div>
                    </Stack>
                </div>
            </section>
        </div>
    )
}

export default ProjectsPage