import React, { useEffect, useState } from 'react';
import { Grid, Pagination, Stack, Skeleton } from '@mui/material';
import Project from '../components/projects/Project';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    // your existing styles...
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
    const [loading, setLoading] = useState(true); // New loading state
    const navigate = useNavigate();

    const fetchAllProjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_KEY}/project/public/all?size=${rowsPerPage}&page=${page > 0 ? page - 1 : page}`);
            setProjects(res.data.data.projects);
            setMaxRecords(Math.ceil(res.data.data.maxRecords / rowsPerPage));
            setLoading(false);
        } catch (e) {
            console.log(e.response?.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, [page, rowsPerPage]);

    return (
        <div style={{ paddingTop: "100px" }}>
            <section id="projects">
                <p class="section__text__p1">Browse All My</p>
                <h1 class="title">Projects Done</h1>
                <div class="experience-details-container">
                    <div class="about-containers">
                        <Grid container rowGap={8} columnSpacing={8}>
                            {loading
                                ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Skeleton variant="rectangular" width={300} height={400} />
                                        <Skeleton width="60%" height={30} style={{ marginTop: '10px' }} />
                                        <Skeleton width="40%" height={30} style={{ marginTop: '5px' }} />
                                    </Grid>
                                ))
                                : projects?.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Project data={item} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                    <Stack alignItems={"center"} justifyContent={"center"}>
                        <div className={classes.paginationContainer}>
                            <Pagination
                                size="large"
                                count={maxRecords}
                                color={"primary"}
                                page={page}
                                onChange={(e, newPage) => setPage(newPage)}
                                classes={{ ul: classes.pagination }}
                            />
                        </div>
                    </Stack>
                </div>
            </section>
        </div>
    );
}

export default ProjectsPage;
