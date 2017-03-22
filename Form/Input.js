/**
 * Created by sinires on 16.03.17.
 */
import React, {PropTypes, Component} from "react";
import InputMask from "react-input-mask";

import './style.less'

export default class Input extends Component {
    static checkValidation(pattern, value, isRequired){
        if(value && value.length > 0)
            return new RegExp(pattern).test(value);
        else return !isRequired;
    }

    static getClassName(name, isValid){
        return name && `${name} ${name}-${isValid?'valid':'error'}`
    }

    constructor(props) {
        super(props);
        const {isRequired, value, defaultValue, pattern} = props,
              localValue = value || defaultValue;
        this.state = {
            localValue,
            isValid: Input.checkValidation(pattern, localValue, isRequired)
        };
        this.onChange = this.onChange.bind(this);
        this.getData  = this.getData.bind(this);
        this.onClick  = this.onClick.bind(this);
        this.onFocus  = this.onFocus.bind(this);
        this.onBlur   = this.onBlur.bind(this);
    }

    getData(value){
        const {name} = this.props;
        let result = {value};
        name && (result.name = name);
        return result;
    }

    onChange(event) {
        const {state, props, getData} = this,
              {pattern, onChange, onValidChange, value, isRequired, name} = props,
              {isValid, localValue} = state,
              newValue = event.target.value,
              valid = Input.checkValidation(pattern, newValue, isRequired);

        if (isValid !== valid)
            onValidChange(getData(valid));

        if (localValue !== newValue)
            onChange(getData(newValue));

        !value && this.setState({
                localValue: newValue,
                isValid: valid
            })
    }

    onClick(event){
        const {getData, props} = this,
              {onClick} = props;
        onClick(getData(event));
    }

    onFocus(event){
        const {getData, props} = this,
              {onFocus} = props;
        onFocus(getData(event));
    }

    onBlur(event){
        const {getData, props} = this,
              {onBlur} = props;
        onBlur(getData(event));
    }

    render(){
        const {onClick, onFocus, onBlur, onChange} = this,
              { className,
                customClass,

                mask,
                maskChar,
                formatChars,
                placeholder,
                isFocus
              } = this.props,
              {isValid, localValue} = this.state;

        return (
            <InputMask
                className={`${Input.getClassName(className, isValid)} ${Input.getClassName(customClass, isValid)}`}
                autoFocus={isFocus} value={localValue} placeholder={placeholder} title={placeholder}
                mask={mask} maskChar={maskChar} formatChars={formatChars}
                onChange={onChange} onBlur={onBlur} onFocus={onFocus} onClick={onClick}
            />
        )
    }

    componentWillReceiveProps(nextProps){
        const {value, pattern, isRequired} = nextProps;
        if(this.props.value !== value){
            this.setState({
                localValue: value,
                isValid: Input.checkValidation(pattern, value, isRequired)
            });
        }
    }
}

Input.defaultProps = {
    className: 'input-text',
    customClass: '',

    name: Math.random().toString().replace("0.",""),

    mask: '',
    maskChar: '',
    formatChars:{
        "9": "[0-9]",
        "a": "[A-Za-z]",
        "*": "[A-Za-z0-9]"
    },

    pattern: '',
    placeholder: '',

    onClick:()=>{},
    onChange:()=>{},
    onFocus:()=>{},
    onBlur:()=>{},
    onValidChange:()=>{}
};

Input.propTypes = {
    className: PropTypes.string,
    customClass: PropTypes.string,

    name: PropTypes.string,

    mask: PropTypes.string,
    maskChar: PropTypes.string,
    formatChars: PropTypes.object,

    pattern: PropTypes.string,
    placeholder: PropTypes.string,

    value: PropTypes.string,
    defaultValue: PropTypes.string,
    isFocus: PropTypes.bool,
    isRequired: PropTypes.bool,

    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onValidChange: PropTypes.func,
};

