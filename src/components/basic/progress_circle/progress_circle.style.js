import styled, {css} from "styled-components";

export const Container = styled.div`
    transition: all 1s ease;
    width: 100%;
    height: 100%;
    
  .loader {
    position: relative;
    width: 100%;
    height: 100%;
    //float: left;
    user-select: none;
    box-sizing: border-box;
  }

  .loader-bg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 5px solid ${props => props.inactiveColor ? props.inactiveColor : props.theme.bg.quaternary};
    box-sizing: border-box;
  }

  .spiner-holder-one {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 50%;
    height: 50%;
    //background: transparent;
    box-sizing: border-box;
  }

  .spiner-holder-two {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: transparent;
    box-sizing: border-box;
  }

  .loader-spiner {
    width: 200%;
    height: 200%;
    border-radius: 50%;
    border: 5px solid ${props => props.activeColor ? props.activeColor : props.theme.fg.secondary};
    box-sizing: border-box;
  }

  .animate-0-25-a {
    transform: rotate(90deg);
    transform-origin: 100% 100%;
  }

  .animate-0-25-b {
    transform: rotate(-90deg);
    transform-origin: 100% 100%;

    ${props =>  `transform: rotate(${props.firstQuarterAngle}deg)`};

  }

  .animate-25-50-a {
    transform: rotate(180deg);
    transform-origin: 100% 100%;
  }

  .animate-25-50-b {
    transform: rotate(-90deg);
    transform-origin: 100% 100%;
    ${props => `transform: rotate(${props.secondQuarterAngle}deg)`};
  }

  .animate-50-75-a {
    transform: rotate(270deg);
    transform-origin: 100% 100%;
  }

  .animate-50-75-b {
    transform: rotate(-90deg);
    transform-origin: 100% 100%;
    ${props => `transform: rotate(${props.thirdQuarterAngle}deg)`};
  }

  .animate-75-100-a {
    transform: rotate(0deg);
    transform-origin: 100% 100%;
  }

  .animate-75-100-b {
    transform: rotate(-90deg);
    transform-origin: 100% 100%;
    ${props => `transform: rotate(${props.fourthQuarterAngle}deg)`};
  }

  .text {
    text-align: center;
    padding-top: 32%;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    color: red;
  }
`