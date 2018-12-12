import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
};
const defaultProps = {
  type: 'timing',
  duration: 500,
};
/**
 */
class AnimatedText extends React.PureComponent {
  constructor(props) {
    super(props);

    const animatedValue = new Animated.Value(1);
    animatedValue.addListener(this.onValueChanged);

    const { value } = props;

    this.state = {
      animatedValue,
      value,
      originValue: value,
      originLength: value.length,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.change(nextProps);
    }
  }
  onValueChanged = e => {
    const { originValue, originLength } = this.state;

    const sub = Math.ceil(originLength * e.value);

    this.setState({
      value: originValue.substr(0, Math.max(sub, 1)),
    });
  };
  change = props => {
    const { value, style, type, ...rest } = props;
    const { animatedValue } = this.state;

    Animated[type](animatedValue, {
      toValue: 0,
      ...rest,
    }).start(() => {
      this.setState({
        originValue: value,
        originLength: value.length,
      });

      Animated[type](animatedValue, {
        toValue: 1,
        ...rest,
      }).start();
    });
  };
  render() {
    const { renderValue } = this.props;
    const { value } = this.state;

    return renderValue(value);
  }
}

AnimatedText.propTypes = propTypes;
AnimatedText.defaultProps = defaultProps;

export default AnimatedText;
