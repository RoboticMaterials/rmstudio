import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    max-width: 100%;
    width: 100%;
    align-items: center;

    background: ${props => props.theme.bg.octonary};

    flex: 1;
`

export const ConnectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    width: 100%;
`

export const DeviceName = styled.p`
    font: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
`

export const LiveText = styled.span`
    font: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    color: red;

    position: absolute;
    right: 1rem;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
  padding-top: .2rem;
  padding-bottom: .2rem;
`
