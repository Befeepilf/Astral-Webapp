import Link from 'next/link';
import Head from 'next/head';

import {resolve} from 'styled-jsx/css';

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ScheduleIcon from '@material-ui/icons/Schedule';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';

import {TEXT_PRIMARY} from 'colors.js';

const theme = createMuiTheme({
    palette: {
        text: {
            primary: TEXT_PRIMARY
        },
        action: {
            active: TEXT_PRIMARY
        }
    }
});

const btnAllMovies = resolve`
    margin-right: auto;
    text-transform: none;
    border: 1px solid grey;
    border-radius: 35px;
`;

export default function App({Component, pageProps}) {
    return (
        <ThemeProvider theme={theme}>
            <div id="app">
                <Head>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                </Head>

                <header className="container">
                    <h1>Astral</h1>
                    <Button
                        variant="outlined"
                        startIcon={<ScheduleIcon/>}
                        disableElevation
                        className={btnAllMovies.className}
                    >All movies</Button>

                    <div className="profile"></div>
                    <IconButton>
                        <SearchIcon/>
                    </IconButton>
                    <IconButton>
                        <MenuIcon/>
                    </IconButton>
                </header>

                <Component {...pageProps}/>

                <footer className="container">
                    <nav>
                        <Link href="/"><a>Home page</a></Link>
                        <Link href="/#all-movies"><a>All movies</a></Link>
                        <Link href="/#coming-soon"><a>Soon on the screens</a></Link>
                        <Link href="/about"><a>About us</a></Link>
                    </nav>

                    <nav>
                        <Link href="">
                            <a>
                                <FacebookIcon/>
                                <span>Facebook</span>
                            </a>
                        </Link>
                        <Link href="">
                            <a>
                                <YouTubeIcon/>
                                <span>YouTube</span>
                            </a>
                        </Link>
                        <Link href="">
                            <a>
                                <InstagramIcon/>
                                <span>Instagram</span>
                            </a>
                        </Link>
                    </nav>
                </footer>


                <style jsx>{`
                    header {
                        display: flex;
                        align-items: center;
                    }

                    .btn-all-movies {
                        margin-right: auto;
                    }

                    footer {
                        display: flex;
                        justify-content: space-between;
                        padding-top: 35px;
                        padding-bottom: 35px;
                        border-top: 1px solid grey;
                    }

                    footer a {
                        display: inline-flex;
                        align-items: center;
                    }
                `}</style>

                {btnAllMovies.styles}

                <style jsx global>{`
                    html,
                    body {
                        padding: 0;
                        margin: 0;
                        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                            sans-serif;
                        color: ${TEXT_PRIMARY};
                        background-color: #212121;
                    }
        
                    * {
                        box-sizing: border-box;
                    }

                    a {
                        text-decoration: none;
                        color: inherit;
                    }

                    #app {
                        display: flex;
                        flex-direction: column;
                        width: 100vw;
                        min-height: 100vh;
                    }

                    main {
                        flex: 1;
                    }

                    .container {
                        max-width: 100%;
                        padding-left: 35px;
                        padding-right: 35px;
                    }
                `}</style>
            </div>
        </ThemeProvider>
    );
}