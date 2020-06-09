import {useSelector} from 'react-redux';
import {resolve} from 'styled-jsx/css';
import {Image, Transformation} from 'cloudinary-react';


const hiddenImg = resolve`
    display: none;
`;

export default function MoviePoster(props) {
    const baseUrl = useSelector(({tmdbConf}) => tmdbConf.images.secure_base_url);
    const sizes = useSelector(({tmdbConf}) => {
        switch(props.type) {
            case 'poster':
                return tmdbConf.images.poster_sizes;
            case 'backdrop':
                return tmdbConf.images.backdrop_sizes;
            default:
                return [];
        }
    });

    return (
        <React.Fragment>
            <Image
                type="fetch"
                publicId={`${baseUrl}original${props.src}`}
                responsive
                dpr="auto"
                width="auto"
                crop="scale"
                responsiveUseBreakpoints="true"
                className={props.hidden ? hiddenImg.className : ''}
            >
                <Transformation quality="auto" fetchFormat="auto"/>
            </Image>
            
            {hiddenImg.styles}
        </React.Fragment>
    );
}