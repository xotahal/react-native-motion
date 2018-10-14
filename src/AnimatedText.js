import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
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
    if (this.props.value !== nextProps.value) {
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

    Animated[type](this.state.animatedValue, {
      toValue: 0,
      ...rest,
    }).start(() => {
      this.setState({
        originValue: value,
        originLength: value.length,
      });

      Animated[type](this.state.animatedValue, {
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
