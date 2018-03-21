import React, { PureComponent } from 'react';
import {
  Easing,
  Animated,
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  // One of these are required
  id: PropTypes.string,
  sourceId: PropTypes.string,
  // Set to true if we want to start with animation immediately when a
  // destination element is mounted
  startOnDestinationDidMount: PropTypes.bool,
  // Set to true if we want to start with animation immediately when a
  // destination element is unmounted
  startOnDestinationWillUnmount: PropTypes.bool,
};
const defaultProps = {
  startOnDestinationDidMount: false,
  startOnDestinationWillUnmount: false,
};
const contextTypes = {
  moveSharedElement: PropTypes.func.isRequired,
};

// Hashtable of elements which are shared between source element and destination
// element.
let elements = {};
// Test if the shred element is destination or source
const isDestination = props => {
  return !!props.sourceId;
};
// Destination element has id as a sourceId and source element has an id as an
// id prop
const getKey = props => {
  return props.id || props.sourceId;
};
// Create a element with provided id
const initElement = props => {
  const { id, sourceId } = props;
  const key = id || sourceId;

  elements[key] = elements[key] || {
    id: key,
    // source element of this shared element
    source: {
      // we want to keep ref to measure position on screen
      ref: null,
      // to be able fire events
      props: null,
      // last known position of source - when we lost ref (element was unmounted)
      // we are still able to show animation even when the element is already
      // doesn't exist, because we actualy will create new one for animation
      // anyway, if the source element was part of scrollview for example and
      // his position was changed since last measure, it will start in bad
      // position - we need to solve this somehow
      position: null,
    },
    // destination element of this shared element
    destination: {
      // it's the same like source, only for destination
      ref: null,
      props: null,
      position: null,
    },
  };
};
// To store props of source and destination. We want to fire event even for
// source element if the destination was animated.
const setProps = props => {
  const key = getKey(props);

  if (isDestination(props)) {
    elements[key].destination.props = props;
  } else {
    elements[key].source.props = props;
  }
};
// To store references of elements.
const setRef = (props, node) => {
  const key = getKey(props);

  if (isDestination(props)) {
    elements[key].destination.ref = node;
  } else {
    elements[key].source.ref = node;
  }
};
// Node which will be animated. We are trying to observe element as a clone of
// children. But if we want to do something with that children (for example
// set an opacity once it is moved, it is better to provide getNode)
const setNode = props => {
  const key = getKey(props);

  // if we already have a node
  if (elements[key].node) {
    return;
  }

  if (props.getNode) {
    elements[key].node = props.getNode(props);
  } else {
    // this node will be animated
    elements[key].node = React.cloneElement(props.children);
  }
};
const setSourcePosition = (props, position) => {
  if (!position) {
    return;
  }

  set(props, 'waitingForSource', false);

  const key = getKey(props);
  elements[key].source.position = position;
};
const setDestinationPosition = (props, position) => {
  if (!position) {
    return;
  }

  set(props, 'waitingForDestination', false);

  const key = getKey(props);
  elements[key].destination.position = position;
};
const set = (props, propName, value) => {
  const key = getKey(props);
  elements[key][propName] = value;
};
const get = (props, propName) => {
  const key = getKey(props);
  return elements[key][propName];
};
const getElement = props => {
  const key = getKey(props);
  return elements[key];
};
const getAnimationConfig = props => {
  // get only animation config
  const {
    id,
    sourceId,
    children,
    onMoveToSourceWillStart,
    onMoveToSourceDidFinish,
    onMoveToDestinationWillStart,
    onMoveToDestinationDidFinish,
    startOnDestinationDidMount,
    startOnDestinationWillUnmount,
    // should contains only animation config
    ...animationConfig
  } = props;

  return animationConfig;
};
const getAnimationConfigOfSource = props => {
  const element = getElement(props);
  return getAnimationConfig(element.source.props);
};
const getAnimationConfigOfDestination = props => {
  const element = getElement(props);
  return getAnimationConfig(element.destination.props);
};
const fireEvent = (props, name) => {
  if (props[name]) {
    props[name]();
  }
};

class SharedElement extends PureComponent {
  constructor(props) {
    super(props);
    // just create an object for this shared element
    initElement(props);
  }
  componentDidMount() {
    setProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    setProps(nextProps);
  }
  componentWillUnmount() {
    const { startOnDestinationWillUnmount } = this.props;

    if (startOnDestinationWillUnmount && isDestination(this.props)) {
      const { moveSharedElement } = this.context;
      const { sourceId, children, onMoveComplete, ...rest } = this.props;
      const element = getElement(this.props);

      this.moveToSource();
    }
  }
  setRef = node => {
    setRef(this.props, node);
    // Call the original ref, if there is any
    const { ref } = this.props.children;
    if (typeof ref === 'function') {
      ref(node);
    }
  };
  measure = (ref, callback) => {
    if (!ref) {
      callback(null);
    }

    ref.measure((x, y, width, height, pageX, pageY) => {
      const position = { x, y, width, height, pageX, pageY };
      callback(position);
    });
  };
  moveToDestination = () => {
    const { moveSharedElement } = this.context;

    setNode(this.props);
    const element = getElement(this.props);

    if (!element.destination.position) {
      set(this.props, 'waitingForDestination', true);
    } else {
      moveSharedElement({
        animationConfig: getAnimationConfigOfSource(this.props),
        element: getElement(this.props),
        onMoveWillStart: this.onMoveToDestinationWillStart,
        onMoveDidComplete: this.onMoveToDestinationDidFinish,
      });
    }
  };
  moveToSource = () => {
    const { moveSharedElement } = this.context;

    setNode(this.props);
    const element = getElement(this.props);

    if (!element.source.position) {
      set(this.props, 'waitingForSource', true);
    } else {
      moveSharedElement({
        animationConfig: getAnimationConfigOfDestination(this.props),
        element: {
          ...element,
          destination: element.source,
          source: element.destination,
        },
        onMoveWillStart: this.onMoveToSourceWillStart,
        onMoveDidComplete: this.onMoveToSourceDidFinish,
      });
    }
  };
  onMoveToDestinationWillStart = config => {
    const { source, destination } = getElement(this.props);

    fireEvent(source.props, 'onMoveToDestinationWillStart');
    fireEvent(destination.props, 'onMoveToDestinationWillStart');
  };
  onMoveToDestinationDidFinish = config => {
    const { source, destination } = getElement(this.props);

    // will get the node again later when we need it - we need always current
    // node beucase it could be changed during
    set(this.props, 'node', null);

    fireEvent(source.props, 'onMoveToDestinationDidFinish');
    fireEvent(destination.props, 'onMoveToDestinationDidFinish');
  };
  onMoveToSourceWillStart = config => {
    const { source, destination } = getElement(this.props);

    fireEvent(destination.props, 'onMoveToSourceWillStart');
    fireEvent(source.props, 'onMoveToSourceWillStart');
  };
  onMoveToSourceDidFinish = config => {
    const { source, destination } = getElement(this.props);

    // will get the node again later when we need it - we need always current
    // node beucase it could be changed during
    set(this.props, 'node', null);

    fireEvent(destination.props, 'onMoveToSourceDidFinish');
    fireEvent(source.props, 'onMoveToSourceDidFinish');
  };
  onSourceLayout = data => {
    const element = getElement(this.props);

    const { ref } = element.source;
    this.measure(ref, position => {
      const startAnimation = get(this.props, 'waitingForSource');
      setSourcePosition(this.props, position);

      // if the user wanted to move to destination but there wasn't source yet
      if (startAnimation) {
        this.moveToSource();
      }
    });

    // Call original if any
    const { onLayout } = this.props.children;
    if (typeof onLayout === 'function') {
      onLayout(data);
    }
  };
  onDestinationLayout = data => {
    const { startOnDestinationDidMount } = this.props;
    const { source, destination } = getElement(this.props);

    this.measure(source.ref, position => {
      setSourcePosition(this.props, position);

      this.measure(destination.ref, position => {
        const startAnimation = get(this.props, 'waitingForDestination');
        setDestinationPosition(this.props, position);

        if (startAnimation || startOnDestinationDidMount) {
          this.moveToDestination();
        }
      });
    });

    // Call original if any
    const { onLayout } = this.props.children;
    if (typeof onLayout === 'function') {
      onLayout(data);
    }
  };
  renderSource() {
    const { children } = this.props;

    return React.cloneElement(this.props.children, {
      ref: this.setRef,
      onLayout: this.onSourceLayout,
    });
  }
  renderDestination() {
    const { children } = this.props;

    return React.cloneElement(children, {
      ref: this.setRef,
      onLayout: this.onDestinationLayout,
    });
  }
  render() {
    const { sourceId } = this.props;

    if (!sourceId) {
      return this.renderSource();
    }

    return this.renderDestination();
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  positionContainer: {
    position: 'absolute',
  },
});

SharedElement.propTypes = propTypes;
SharedElement.defaultProps = defaultProps;
SharedElement.contextTypes = contextTypes;

export default SharedElement;
