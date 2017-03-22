/**
 * Created by sinires on 16.03.17.
 */
import React, {PropTypes, Component} from "react";
import './style.less'

export default class Label extends Component {
    render(){
        const {label, className, customClass, onClick} = this.props;
        return (
            <label title={label} className={`${className} ${customClass}`} onClick={onClick}>
                {label}
            </label>
        )
    }
}

Label.defaultProps = {
    name: Math.random().toString().replace("0.",""),
    className: 'label',
    customClass: '',
    onClick:()=>{}
};

Label.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    customClass: PropTypes.string,
    onClick: PropTypes.func
};

