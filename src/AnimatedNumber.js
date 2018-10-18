import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};
/**
 */
class AnimatedNumber extends React.PureComponent {
  constructor(props) {
    super(props);

    const animatedValue = new Animated.Value(props.value);
    animatedValue.addListener(this.onValueChanged);

    this.state = {
      animatedValue,
      value: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.move(nextProps);
    }
  }
  onValueChanged = e => {
    this.setState({
      value: e.value,
    });
  };
  move = props => {
    const { value, style, type, ...rest } = props;

    Animated[type](this.state.animatedValue, {
      toValue: value,
      ...rest
    }).start();
  };
  render() {
    const { renderValue } = this.props;
    const { value } = this.state;

    return renderValue(value);
  }
}

AnimatedNumber.propTypes = propTypes;
AnimatedNumber.defaultProps = defaultProps;

export default AnimatedNumber;
