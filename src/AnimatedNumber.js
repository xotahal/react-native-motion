import React from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  startOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  value: 0,
  initialValue: null,
  startOnDidMount: false,
  useNativeDriver: true,
};
/**
 */
class AnimatedNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    const { initialValue } = props
    const firstValue = initialValue !== null ? initialValue : props.value
    const animatedValue = new Animated.Value(firstValue);
    animatedValue.addListener(this.onValueChanged);

    this.state = {
      animatedValue,
      value: firstValue,
    };
  }
  componentDidMount() {
    const { startOnDidMount } = this.props;
    if (startOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(this.props);
      });
    }
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
      ...rest,
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