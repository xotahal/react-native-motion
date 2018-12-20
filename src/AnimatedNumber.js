import React from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.number,
  initialValue: PropTypes.number,
  animateOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};
const defaultProps = {
  type: 'timing',
  value: 0,
  initialValue: null,
  animateOnDidMount: false,
  useNativeDriver: false,
};
/**
 */
class AnimatedNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    const { initialValue } = props;
    const firstValue = initialValue !== null ? initialValue : props.value;
    const animatedValue = new Animated.Value(firstValue);
    animatedValue.addListener(this.onValueChanged);

    this.state = {
      animatedValue,
      value: firstValue,
    };
  }
  componentDidMount() {
    const { animateOnDidMount } = this.props;
    if (animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(this.props);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
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
    const { animatedValue } = this.state;

    Animated[type](animatedValue, {
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
