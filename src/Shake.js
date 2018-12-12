import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};

class Shake extends PureComponent {
  constructor(props) {
    super(props);

    this.currentValue = 0;

    this.state = {
      animatedValue: new Animated.Value(this.currentValue),
    };
  }
  // componentDidMount
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    // Perform the shake if our `value` prop has been changed and is
    // being changed to a truthy value.
    if (value !== nextProps.value && !!nextProps.value) {
      this.move(nextProps);
    }
  }
  move = props => {
    const { value, style, type, ...rest } = props;
    const { animatedValue } = this.state;

    Animated[type](animatedValue, {
      toValue: this.currentValue === 0 ? 1 : 0,
      ...rest,
    }).start(() => {
      this.currentValue = this.currentValue === 0 ? 1 : 0;
    });
  };
  render() {
    const { animatedValue } = this.state;
    const { style, children, ...rest } = this.props;

    const translateX = animatedValue.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [0, -10, 10, -10, 10, 0],
    });

    const animatedStyle = {
      transform: [{ translateX }],
    };

    return (
      <Animated.View style={[style, animatedStyle]} {...rest}>
        {children}
      </Animated.View>
    );
  }
}

Shake.propTypes = propTypes;
Shake.defaultProps = defaultProps;

export default Shake;
