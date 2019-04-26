import React, { PureComponent } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const childContextTypes = {
  moveSharedElement: PropTypes.func.isRequired,
};

// We need shared element to be rendered after the whole application because it
// be on the screen with position absolute and will cover everything on screen
class SharedElementRenderer extends PureComponent {
  constructor(props) {
    super(props);

    this.isRunning = {};
    this.state = {
      config: null,
    };
  }
  getChildContext() {
    return {
      moveSharedElement: this.moveSharedElement,
    };
  }
  onMoveWillStart = () => {
    const { config } = this.state;
    const { onMoveWillStart, element } = config;
    const { id } = element;

    this.isRunning[id] = true;

    if (onMoveWillStart) {
      onMoveWillStart(config);
    }
  };
  onMoveDidComplete = () => {
    const { config } = this.state;
    const { onMoveDidComplete, element } = config;
    const { id } = element;

    this.isRunning[id] = false;

    if (onMoveDidComplete) {
      onMoveDidComplete(config);
    }

    this.reset();
  };
  reset = () => {
    this.setState({ config: null });
  };
  // This method will compute animations. Position and scale.
  getAnimations = config => {
    const { element, animationConfig } = config;
    const { source, destination } = element;

    const animations = [];
    let translateYValue = 0;

    if (!Number.isNaN(source.position.pageY)) {
      translateYValue = new Animated.Value(source.position.pageY);
    }

    if (source.position.pageY !== destination.position.pageY) {
      this.setState({ translateYValue });

      animations.push(
        Animated.timing(translateYValue, {
          toValue: destination.position.pageY,
          useNativeDriver: true,
          ...animationConfig,
        }),
      );
    }

    return animations;
  };
  moveSharedElement = config => {
    const { id } = config.element;
    // animation was already started
    if (this.isRunning[id]) {
      return;
    }

    const animations = this.getAnimations(config);

    this.setState({
      config,
    });

    setTimeout(() => {
      this.onMoveWillStart();
      Animated.parallel(animations).start(this.onMoveDidComplete);
    }, 0);
  };
  renderSharedElement() {
    const { config, translateYValue } = this.state;
    const { element } = config || {};
    const { source, node } = element || {};
    const { position } = source || {};
    const { height, width } = position || {};

    if (!config) {
      return null;
    }

    const transform = [];

    if (translateYValue) {
      transform.push({ translateY: translateYValue });
    }

    const animatedStyle = {
      height,
      width,
      transform,
    };

    return (
      <View style={styles.container} pointerEvents="none">
        <Animated.View style={[styles.positionContainer, animatedStyle]}>
          {node}
        </Animated.View>
      </View>
    );
  }
  render() {
    const { children } = this.props;

    return (
      <View style={styles.flexContainer}>
        {children}
        {this.renderSharedElement()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  positionContainer: {
    position: 'absolute',
  },
});

SharedElementRenderer.childContextTypes = childContextTypes;

export default SharedElementRenderer;
