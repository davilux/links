import React from "react";
import styled, { keyframes } from "styled-components";

/*-------- ABOUT --------*/
//Created with guidance from Josh Comeau: https://www.joshwcomeau.com/react/animated-sparkles-in-react/

/*-------- USAGE --------*/
//  It can be used on images:
// <Sparkles>
//   <img src="teacup.png" alt="A teacup filled with bubbly lavender tea." />
// </Sparkles>
// And on inline text:
// <p>
//   The phrase all devs know, <Sparkles>Hello World</Sparkles>.
// </p>

/*-------- HELPER FUNCTIONS --------*/

// Utility helper for random number generation
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

//Helper function used to generate an array
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

/*-------- CUSTOM HOOKS --------*/

//Custom hook that works like setInterval, except you pass it two numbers, a min and a max. For each iteration, it picks a random number in that range.
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

//Custom hook. The "prefers reduced motion" media query allows people to indicate that they don't want to see any animations. The usePrefersReducedMotion hook lets us access that value from within JS.
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

/*-------- MAIN FUNCTIONALITY --------*/

//generateSparkle creates the data for a new sparkle instance.
const DEFAULT_COLOR = "#FFFFFFFF";
const generateSparkle = (color) => {
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
    },
  };
  return sparkle;
};

//React component that returns a single sparkle SVG
function SparkleInstance({ color, size, style }) {
  const path =
    "M125 0C125 0 127.551 67.4468 155.052 94.948C182.553 122.449 250 125 250 125C250 125 182.553 127.551 155.052 155.052C127.551 182.553 125 250 125 250C125 250 122.449 182.553 94.948 155.052C67.4468 127.551 0 125 0 125C0 125 67.4468 122.449 94.948 94.948C122.449 67.4468 125 0 125 0Z";
  return (
    <SparkleWrapper>
      <SparkleSvg
        width={size}
        height={size}
        viewBox="0 0 250 250"
        fill="none"
        style={style}
      >
        <path d={path} fill={color} />
      </SparkleSvg>
    </SparkleWrapper>
  );
}

//React component to render all sparkles!
function Sparkles({ color = DEFAULT_COLOR, children }) {
  const [sparkles, setSparkles] = React.useState(() => {
    return range(4).map(() => generateSparkle(color));
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  useRandomInterval(
    () => {
      const sparkle = generateSparkle(color);
      const now = Date.now();
      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt;
        return delta < 750;
      });
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 450
  );

  return (
    <Wrapper>
      {sparkles.map((sparkle) => (
        <SparkleInstance
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  );
}

/*-------- STYLED COMPONENTS --------*/

const comeInOut = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;
const Wrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const SparkleWrapper = styled.span`
  position: absolute;
  display: block;
  z-index: 2;
  pointer-events: none;
`;

const SparkleSvg = styled.svg`
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${comeInOut} 700ms ease-in-out forwards;
  }
`;

const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
`;

export default Sparkles;
