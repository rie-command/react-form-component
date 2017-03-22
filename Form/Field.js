/**
 * Created by sinires on 16.03.17.
 */
import React, {PropTypes, Component, Children, cloneElement} from "react";
import './style.less'

export default class Field extends Component {
    constructor(props){
        super(props);

        this.state = {isValid: true};

        this.proxyChild = this.proxyChild.bind(this);
        this.onValidChange = this.onValidChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    static getClassName(name, isValid){
        return name && `${name} ${name}-${isValid?'valid':'error'}`
    }

    static getArrayKey4State(state){
        return Object.keys(state).filter(key=>key!=="isValid")
    }

    render(){
        const {children, className, customClass} = this.props,
              {isValid} = this.state;

        return (
            <div className={`${Field.getClassName(className,isValid)} ${Field.getClassName(customClass, isValid)}`}>
                {React.Children.map(children, this.proxyChild)}
            </div>
        )
    }

    onChange(){
        const {props, state} = this,
              {name, onChildChange} = props,
              value = Field.getArrayKey4State(state)
                        .map(key => {
                             let value = state[key].onChange;
                             return {key, value}
                        });
        onChildChange({name, value});
    }

    onValidChange(event, child){
        const {props, state} = this,
              {name, onChildValidChange} = props,
              value = {
                  isValid: null,
                  validChild: [],
                  invalidChild: []
              };
        Field.getArrayKey4State(state)
            .forEach((key)=>{
                let localValue = state[key].onValidChange;
                if(typeof localValue !== "boolean" && !child.props.isRequired || localValue)
                    value.validChild.push(key);
                else
                    value.invalidChild.push(key);
            });
        value.isValid = !value.validChild.length;

        this.setState({isValid:value.isValid});

        onChildValidChange({name, value});
    }

    onEvent(name, child, event){
        const {name:key, value} = event;
        child.props[name] && child.props[name](event);

        let state = this.state;
        (state[key] || (state[key] = {}))
            && (state[key][name] = value);
        this.setState(state, ()=>{this[name] && this[name](event, child)});
    }

    proxyChild(child){
        return cloneElement(child, {
            onChange: (event)=>{this.onEvent("onChange", child, event)},
            onValidChange: (event)=>{this.onEvent("onValidChange", child, event)}
        });
    }
}

Field.propTypes = {
    children: PropTypes.array.isRequired,

    name: PropTypes.string,

    className: PropTypes.string,
    customClass: PropTypes.string,

    onChildChange: PropTypes.func,
    onChildValidChange: PropTypes.func
};

Field.defaultProps = {
    className: 'field',
    customClass: '',

    name: Math.random().toString().replace("0.",""),

    onChange: ()=>{},
    onValidChange: ()=>{}
};
