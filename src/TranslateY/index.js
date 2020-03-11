import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  delay: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  initialValue: PropTypes.number,
  startOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  value: 0,
  duration: 500,
  delay: 0,
  initialValue: null,
  startOnDidMount: false,
  useNativeDriver: true,
};

class TranslateY extends PureComponent {
  constructor(props) {
    super(props);

    const { value, initialValue } = props;

    this.state = {
      translateYValue: new Animated.Value(
        initialValue !== null ? initialValue : value,
      ),
    };
  }
  componentDidMount() {
    const { startOnDidMount, value } = this.props;
    if (startOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(value);
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {
      this.move(value);
    }
  }
  move = toValue => {
    const { style, type, pointerEvents, ...rest } = this.props;
    const { translateYValue } = this.state;

    Animated[type](translateYValue, {
      toValue,
      ...rest,
    }).start();
  };
  render() {
    const { style, children, pointerEvents } = this.props;
    const { translateYValue } = this.state;

    const animatedStyle = {
      transform: [{ translateY: translateYValue }],
    };

    return (
      <Animated.View
        style={[style, animatedStyle]}
        pointerEvents={pointerEvents}
      >
        {children}
      </Animated.View>
    );
  }
}

TranslateY.propTypes = propTypes;
TranslateY.defaultProps = defaultProps;

export default TranslateY;
