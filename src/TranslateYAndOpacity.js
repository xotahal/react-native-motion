import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  opacityMin: PropTypes.number,
  translateYMin: PropTypes.number,
  duration: PropTypes.number,
  startOnDidMount: PropTypes.bool,
};
const defaultProps = {
  opacityMin: 0,
  translateYMin: -4,
  duration: 500,
  startOnDidMount: false,
};

class TranslateYAndOpacity extends PureComponent {
  constructor(props) {
    super(props);

    const { opacityMin, translateYMin } = props;

    this.state = {
      opacityValue: new Animated.Value(opacityMin),
      translateYValue: new Animated.Value(translateYMin),
    };
  }
  componentDidMount() {
    const { startOnDidMount } = this.props;

    if (startOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.show(this.props);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isHidden && nextProps.isHidden) {
      this.hide(nextProps);
    }
    if (this.props.isHidden && !nextProps.isHidden) {
      this.show(nextProps);
    }
  }
  show(props) {
    const { opacityValue, translateYValue } = this.state;
    const { duration, delay, onShowDidFinish } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
        delay,
      }),
      Animated.timing(translateYValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
        delay,
      }),
    ]).start(() => {
      if (onShowDidFinish) {
        onShowDidFinish(props);
      }
    });
  }
  hide(props) {
    const { translateYValue, opacityValue } = this.state;
    const {
      duration,
      delay,
      opacityMin,
      translateYMin,
      onHideDidFinish,
    } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: opacityMin,
        useNativeDriver: true,
        duration,
        delay,
      }),
      Animated.timing(translateYValue, {
        toValue: translateYMin,
        useNativeDriver: true,
        duration,
        delay,
      }),
    ]).start(() => {
      if (onHideDidFinish) {
        onHideDidFinish(props);
      }
    });
  }
  render() {
    const { opacityValue, translateYValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };

    return (
      <Animated.View style={animatedStyle}>{this.props.children}</Animated.View>
    );
  }
}

TranslateYAndOpacity.propTypes = propTypes;
TranslateYAndOpacity.defaultProps = defaultProps;

export default TranslateYAndOpacity;
