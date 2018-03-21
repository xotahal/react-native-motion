import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  opacityMin: PropTypes.number,
  scaleMin: PropTypes.number,
  duration: PropTypes.number,
  animateOnDidMount: PropTypes.bool,
};
const defaultProps = {
  opacityMin: 0,
  scaleMin: 0.8,
  duration: 500,
  animateOnDidMount: true,
};

class ScaleAndOpacity extends PureComponent {
  constructor(props) {
    super(props);

    const { animateOnDidMount, opacityMin, scaleMin } = props;

    this.state = {
      opacityValue: new Animated.Value(animateOnDidMount ? opacityMin : 1),
      scaleValue: new Animated.Value(animateOnDidMount ? scaleMin : 1),
    };
  }
  componentDidMount() {
    if (this.props.animateOnDidMount) {
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
  hide = props => {
    const { scaleMin, opacityMin, duration, onHideComplete } = props;

    Animated.parallel([
      Animated.timing(this.state.scaleValue, {
        toValue: scaleMin,
        useNativeDriver: true,
        duration,
      }),
      Animated.timing(this.state.opacityValue, {
        toValue: opacityMin,
        useNativeDriver: true,
        duration,
      }),
    ]).start(() => {
      if (onHideComplete) {
        onHideComplete(props);
      }
    });
  };
  show = props => {
    const { scaleValue, opacityValue } = this.state;
    const { duration, onShowComplete } = props;

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        duration,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        useNativeDriver: true,
        duration,
      }),
    ]).start(() => {
      if (onShowComplete) {
        onShowComplete(props);
      }
    });
  };
  render() {
    const { opacityValue, scaleValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      transform: [
        {
          scale: scaleValue,
        },
      ],
    };

    return (
      <Animated.View style={animatedStyle}>{this.props.children}</Animated.View>
    );
  }
}

ScaleAndOpacity.propTypes = propTypes;
ScaleAndOpacity.defaultProps = defaultProps;

export default ScaleAndOpacity;
