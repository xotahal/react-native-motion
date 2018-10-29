import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};

class TranslateY extends PureComponent {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      translateYValue: new Animated.Value(value),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.move(nextProps.value);
    }
  }
  move = toValue => {
    const { style, type, ...rest } = this.props;
    const { translateYValue } = this.state;

    Animated[type](translateYValue, {
      toValue,
      ...rest,
    }).start();
  };
  render() {
    const { style, children } = this.props;
    const { translateYValue } = this.state;

    const animatedStyle = {
      transform: [{ translateY: translateYValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateY.propTypes = propTypes;
TranslateY.defaultProps = defaultProps;

export default TranslateY;
