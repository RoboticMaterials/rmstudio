import styled from "styled-components"

export const Container = styled.div`
  
  animation: ${props => props.wobble && "wobble 1s linear infinite"};
  @keyframes wobble {
    0% {
      transform: translateX(0%);
    }
    15% {
      transform: translateX(-25%) rotate(-5deg);
    }
    30% {
      transform: translateX(20%) rotate(3deg);
    }
    45% {
      transform: translateX(-15%) rotate(-3deg);
    }
    60% {
      transform: translateX(10%) rotate(2deg);
    }
    75% {
      transform: translateX(-5%) rotate(-1deg);
    }
    100% {
      transform: translateX(0%);
    }
  }
`
