import {useSelector} from 'react-redux';
import css from 'styled-jsx/css'; // https://github.com/vercel/styled-jsx/issues/469#issuecomment-418851282
import classNames from 'classnames';
import {Image, Transformation} from 'cloudinary-react';


const hiddenImg = (css.resolve)`
    display: none;
`;

export default function MovieImage(props) {
    const baseUrl = useSelector(({tmdbConf}) => tmdbConf.images.secure_base_url);

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
                className={classNames(props.className, {[hiddenImg.className]: props.hidden})}
            >
                <Transformation quality={props.quality || 'auto:good'} fetchFormat="auto"/>
            </Image>
            
            {hiddenImg.styles}
        </React.Fragment>
    );
}