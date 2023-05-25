import React from "react";
import styled, { keyframes } from "styled-components";

//Created following a tutorial by Josh Comeau: https://www.joshwcomeau.com/react/animated-sparkles-in-react/

//Usage:
//  It can be used on images:
// <Sparkles>
//   <img src="teacup.png" alt="A teacup filled with bubbly lavender tea." />
// </Sparkles>
// And on inline text:
// <p>
//   The phrase all devs know, <Sparkles>Hello World</Sparkles>.
// </p>

// Utility helper for random number generation
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    let isEnabled =
      typeof minDelay === "number" && typeof maxDelay === "number";
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

const QUERY = "(prefers-reduced-motion: no-preference)";
const getInitialState = () => !window.matchMedia(QUERY).matches;
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState(getInitialState);
  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };
    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);
  return prefersReducedMotion;
}

const range = (start, end, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

//generateSparkle creates the data for a new sparkle instance.
const DEFAULT_COLOR = "#FFFFFFFF";
const generateSparkle = (color = DEFAULT_COLOR) => {
  const sparkle = {
    //TODO: Refactor to make sure IDs are unique.
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(5, 20),
    style: {
      // Pick a random spot in the available space
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
      // Float sparkles above sibling content
      zIndex: 2,
    },
  };
  return sparkle;
};

//react component that returns a single sparkle SVG
function SparkleInstance({ color, size, style }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 250 250"
      fill="none"
      style={style}
    >
      <path
        d="M125 0C125 0 127.551 67.4468 155.052 94.948C182.553 122.449 250 125 250 125C250 125 182.553 127.551 155.052 155.052C127.551 182.553 125 250 125 250C125 250 122.449 182.553 94.948 155.052C67.4468 127.551 0 125 0 125C0 125 67.4468 122.449 94.948 94.948C122.449 67.4468 125 0 125 0Z"
        fill={color}
      />
    </Svg>
  );
}

//In the SparkleInstance component, we wrap the svg in a styled-component, Svg. This lets us add some baseline styles for our sparkle:
const Svg = styled.svg`
  position: absolute;
  //   The following line ensures we can click right on top of a sparkle and the click will go through to the element below, such as a link or button.
  pointer-events: none;
  z-index: 2;
`;

//React component to render all sparkles!
function Sparkles({ children }) {
  const sparkle = generateSparkle();
  return (
    <Wrapper>
      <SparkleInstance
        color={sparkle.color}
        size={sparkle.size}
        style={sparkle.style}
      />
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.span`
  position: relative;
  display: inline-block;
`;
const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
  font-weight: bold;
`;

export default Sparkles;
