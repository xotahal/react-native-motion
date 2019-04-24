import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  initialValue: PropTypes.number,
  animateOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  value: 0,
  initialValue: null,
  animateOnDidMount: false,
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
    const { animateOnDidMount, value } = this.props;
    if (animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(value);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.move(nextProps.value);
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
