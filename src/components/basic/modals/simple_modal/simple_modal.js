import React from "react"
import PropTypes from "prop-types";

import Button from "../../../basic/button/button";

// styles
import * as styled from './simple_modal.style'


const SimpleModal = (props) => {

    const {
        isOpen,
        title,
        onRequestClose,
        onCloseButtonClick,
        handleOnClick1,
        handleOnClick2,
        button_1_text,
        button_2_text,
        children,
        contentLabel
    } = props

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel={contentLabel}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    zIndex: 500
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>{title}</styled.Title>

                <Button
                    onClick={onCloseButtonClick}
                    schema={'error'}
                >
                    <i className="fa fa-times" aria-hidden="true"/>
                </Button>
            </styled.Header>
            <styled.BodyContainer>
                        <styled.ContentContainer>
                            {children}
                        </styled.ContentContainer>

                        <styled.ButtonForm>
                            <Button
                                tertiary
                                schema={"delete"}
                                onClick={handleOnClick1}
                                label={button_1_text}
                                type="button"
                            />
                            <Button
                                tertiary
                                schema={"delete"}
                                onClick={handleOnClick2}
                                label={button_2_text}
                                type="button"
                            />
                        </styled.ButtonForm>
            </styled.BodyContainer>
        </styled.Container>
    );
};

// Specifies propTypes
SimpleModal.propTypes = {
    contentLabel: PropTypes.string,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
    onCloseButtonClick: PropTypes.func,
    handleOnClick1: PropTypes.func,
    handleOnClick2: PropTypes.func,
    button_1_text: PropTypes.string,
    button_2_text: PropTypes.string,
};

// Specifies the default values for props:
SimpleModal.defaultProps = {
    contentLabel: "Simple Modal",
    isOpen: false,
    title: "Simple Modal",
    onRequestClose: () => {},
    onCloseButtonClick: () => {},
    handleOnClick1: () => {},
    handleOnClick2: () => {},
    button_1_text: "Ok",
    button_2_text: "Cancel",
    children: null,
};


export default SimpleModal
