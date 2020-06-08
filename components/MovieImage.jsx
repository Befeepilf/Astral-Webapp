import {useSelector} from 'react-redux';

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
        <picture>
            {sizes.map(size => {
                if(size !== 'original') {
                    const width = size.substr(1);
                    return (
                        <source
                            key={size}
                            srcSet={`${baseUrl}${size}${props.src}`}
                            media={`(max-width: ${width}px)`}
                        />
                    );
                }
            })}
            <img src={`${baseUrl}original${props.src}`}/>

            <style jsx>{`
                & {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                img {
                    object-fit: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            `}</style>
        </picture>
    );
}