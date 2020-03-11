import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  opacityMin: PropTypes.number,
  translateYMin: PropTypes.number,
  duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  delay: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  animateOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};
const defaultProps = {
  opacityMin: 0,
  translateYMin: -4,
  duration: 500,
  delay: 0,
  animateOnDidMount: false,
  useNativeDriver: true,
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
    const { animateOnDidMount } = this.props;

    if (animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.show(this.props);
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { isHidden } = this.props;

    if (!prevProps.isHidden && isHidden) {
      this.hide(this.props);
    }
    if (prevProps.isHidden && !isHidden) {
      this.show(this.props);
    }
  }
  show(props) {
    const { opacityValue, translateYValue } = this.state;
    const { onShowDidFinish, ...rest } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        ...rest,
      }),
      Animated.timing(translateYValue, {
        toValue: 0,
        ...rest,
      }),
    ]).start(() => {
      if (onShowDidFinish) {
        onShowDidFinish(props);
      }
    });
  }
  hide(props) {
    const { translateYValue, opacityValue } = this.state;
    const { opacityMin, translateYMin, onHideDidFinish, ...rest } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: opacityMin,
        ...rest,
      }),
      Animated.timing(translateYValue, {
        toValue: translateYMin,
        ...rest,
      }),
    ]).start(() => {
      if (onHideDidFinish) {
        onHideDidFinish(props);
      }
    });
  }
  render() {
    const { style, children } = this.props;
    const { opacityValue, translateYValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateYAndOpacity.propTypes = propTypes;
TranslateYAndOpacity.defaultProps = defaultProps;

export default TranslateYAndOpacity;
