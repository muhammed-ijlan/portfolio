import React from 'react'
import splashWash from '../../assets/splashhome.png'
import { CardActionArea, Card, CardMedia, Typography, CardContent } from '@mui/material';
function Projects() {
    return (
        <section class="teams" id="teams">
            <div class="max-width">
                <h2 class="title">Projects</h2>
                <div class="container">

                    {/* <div class="card">
                        <a href="https://splashwash.in">

                            <div class="text">SplashWash - NodeJS</div>
                            <div class="image" style={{
                                background: `url(${splashWash})`, backgroundRepeat: "no-repeat",
                                backgroundSize: "100%"
                            }}>
                            </div>
                        </a>
                    </div> */}
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                sx={{ objectFit: "cover" }}
                                height="250"
                                image={splashWash}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Splashwash
                                </Typography>
                                <Typography variant="body2" color="text.secondary" >
                                    Lizards are a widespread group of squamate reptiles, with over 6,000
                                    species, ranging across all continents except Antarctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default Projects