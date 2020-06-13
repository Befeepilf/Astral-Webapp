import Link from 'next/link';
import Head from 'next/head';

import {createStore} from 'redux';
import reducer from 'redux/reducer.js';
import {Provider} from 'react-redux';

import {resolve} from 'styled-jsx/css';

import {createMuiTheme, ThemeProvider, StylesProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import {CloudinaryContext} from 'cloudinary-react';

import ScheduleIcon from '@material-ui/icons/Schedule';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';

import {TEXT_PRIMARY} from 'colors.js';
import getAppProps from 'getAppProps.js';


const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#febc0e'
        },
        text: {
            primary: TEXT_PRIMARY
        },
        action: {
            active: TEXT_PRIMARY
        }
    },
    typography: {
        fontFamily: 'inherit',
        button: {
            textTransform: 'none'
        }
    }
});

const btnAllMovies = resolve`
    padding: 7px 21px 7px;
    margin-left: 35px;
    margin-right: auto;
    font-weight: bold;
    border: 1px solid #fff;
    border-radius: 35px;
`;

const btnAllMoviesIcon = resolve`
    margin-right: 5px;
    font-size: 1rem;
`;

function App({Component, pageProps, initialState}) {
    const [store, setStore] = React.useState(createStore(reducer, initialState));
    return (
        <Provider store={store}>
            <StylesProvider injectFirst> {/* styles are injected in the head; style tags coming first have less priority; inject material-ui styles first so we can override them easily */}
                <ThemeProvider theme={theme}>
                    <CloudinaryContext cloudName="befeepilf" secure>
                        <div id="app">
                            <Head>
                                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                                <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width"/>
                            </Head>

                            <header>
                                <div className="container">
                                    <h1>Astral</h1>
                                    <Button
                                        variant="outlined"
                                        disableElevation
                                        className={btnAllMovies.className}
                                    >
                                        <ScheduleIcon className={btnAllMoviesIcon.className}/>
                                        All movies
                                    </Button>

                                    <div className="profile"></div>
                                    <IconButton>
                                        <SearchIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton>
                                        <MenuIcon fontSize="large"/>
                                    </IconButton>
                                </div>
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
                                    <Button startIcon={<FacebookIcon/>} href="">Facebook</Button>
                                    <Button
                                        startIcon={<YouTubeIcon/>}
                                        href="https://youtu.be/1uyB3Emp_h0"
                                        target="_blank"
                                    >YouTube</Button>
                                    <Button startIcon={<InstagramIcon/>} href="">Instagram</Button>
                                </nav>
                            </footer>


                            <style jsx>{`
                                header {
                                    position: absolute;
                                    width: 100%;
                                    z-index: 2;
                                    padding-top: 35px;
                                    //background: linear-gradient(to top, transparent, rgba(0, 0, 0, 0.7) 35%);
                                }

                                header .container {
                                    display: flex;
                                    align-items: center;
                                }

                                footer {
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 35px 0;
                                    border-top: 1px solid grey;
                                }

                                footer a {
                                    display: inline-flex;
                                    align-items: center;
                                    margin-right: 56px;
                                }

                                footer a:last-child {
                                    margin-right: 0;
                                }
                            `}</style>

                            {btnAllMovies.styles}
                            {btnAllMoviesIcon.styles}

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
                                    overflow-x: hidden;
                                }
                    
                                * {
                                    z-index: 1;
                                    box-sizing: border-box;
                                }

                                a {
                                    text-decoration: none;
                                    color: inherit;
                                }

                                h1, h2, h3, h4, p {
                                    margin: 0;
                                }

                                img {
                                    object-fit: cover;
                                    width: 100%;
                                    height: 100%;
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

                                main > :first-child {
                                    padding-top: 70px;
                                }

                                .container {
                                    width: 100%;
                                    max-width: calc(100% - 126px);
                                    margin-left: auto;
                                    margin-right: auto;
                                }

                                .bg {
                                    position: absolute;
                                    width: 100%;
                                    height: 100%;
                                    top: 0;
                                    left: 0;
                                    z-index: 0;
                                }
                            `}</style>
                        </div>
                    </CloudinaryContext>
                </ThemeProvider>
            </StylesProvider>
        </Provider>
    );
}

App.getInitialProps = getAppProps;

export default App;