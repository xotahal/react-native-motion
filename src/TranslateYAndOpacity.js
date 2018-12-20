import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  opacityMin: PropTypes.number,
  translateYMin: PropTypes.number,
  duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  animateOnDidMount: PropTypes.bool,
  delay: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};
const defaultProps = {
  opacityMin: 0,
  translateYMin: -4,
  duration: 500,
  animateOnDidMount: false,
  delay: 0,
  useNativeDriver: false,
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
  componentWillReceiveProps(nextProps) {
    const { isHidden } = this.props;

    if (!isHidden && nextProps.isHidden) {
      this.hide(nextProps);
    }
    if (isHidden && !nextProps.isHidden) {
      this.show(nextProps);
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
    const { children } = this.props;
    const { opacityValue, translateYValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  }
}

TranslateYAndOpacity.propTypes = propTypes;
TranslateYAndOpacity.defaultProps = defaultProps;

export default TranslateYAndOpacity;
