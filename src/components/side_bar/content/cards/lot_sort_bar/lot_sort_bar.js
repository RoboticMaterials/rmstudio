import React from 'react';
import PropTypes from 'prop-types';
import * as styled from "../zone_header/zone_header.style";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import {SORT_DIRECTIONS} from "../../../../../constants/lot_contants";
import {isArray} from "../../../../../methods/utils/array_utils";

const MyComponent = (props) => {
    const {
        sortMode,
        setSortMode,
        lotSortOptions
    } = props

    return (
        <styled.ColumnContainer>
            <styled.Description>Sort By:</styled.Description>

            <styled.ItemContainer>
                <DropDownSearch
                    options={lotSortOptions}
                    onChange={(values) => {
                        setSortMode(values[0])
                    }}
                    values={[sortMode]}
                    labelField={"label"}
                    valueField={"label"}
                    schema={"lots"}
                    style={{
                        background: themeContext.bg.tertiary,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: "1rem",
                        borderBottomLeftRadius: "1rem",
                        minWidth: "10rem",
                        borderBottom: `1px solid ${themeContext.bg.quinary}`,
                    }}
                />

                <DropDownSearch
                    options={Object.values(SORT_DIRECTIONS)}
                    values={[sortDirection]}
                    onChange={(values) => {
                        // setLotFilterValue(values)
                        setSortDirection(values[0])
                    }}
                    // onRemoveItem={(values) => {
                    // 	// setLotFilterValue(values)
                    // }}
                    // onClearAll={() => {
                    // 	// setLotFilterValue([])
                    // }}
                    labelField={"id"}
                    valueField={"id"}
                    schema={"lots"}
                    contentRenderer={({ props, state, methods }) => {

                        const {
                            values = []
                        } = state || {}

                        if(isArray(values) && values.length > 0) {
                            return (
                                <>
                                    <styled.ArrowContainer>
                                        {values.map((currItem) => {
                                            const {
                                                iconClassName,
                                                id: currItemId
                                            } = currItem

                                            const isSelected = methods.isSelected(currItem)

                                            return(
                                                <styled.ArrowButton
                                                    style={{
                                                        // paddingTop: ".5rem",
                                                        // paddingBottom: ".5rem",
                                                        // margin: "auto"
                                                    }}
                                                    selected={isSelected}
                                                    key={currItemId}
                                                    type={"button"}
                                                    color={"white"}
                                                    role="option"
                                                    tabIndex="-1"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        methods.dropDown('open');
                                                    }}
                                                    // onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
                                                    schema={props.schema}
                                                    className={iconClassName}
                                                />
                                            )
                                        })}
                                    </styled.ArrowContainer>
                                    <styled.Spacer/>
                                </>
                            )
                        }

                        return(
                            null
                        )
                    }}
                    itemRenderer={({ item, itemIndex, props, state, methods }) => {
                        const {
                            iconClassName,
                            id: currItemId
                        } = item

                        const isSelected = methods.isSelected(item)

                        return(
                            <styled.ArrowButton
                                style={{
                                    paddingTop: ".5rem",
                                    paddingBottom: ".5rem",
                                }}
                                selected={isSelected}
                                key={currItemId}
                                type={"button"}
                                color={"white"}
                                role="option"
                                tabIndex="-1"
                                onClick={item.disabled ? undefined : () => methods.addItem(item)}
                                onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
                                schema={props.schema}
                                className={iconClassName}
                            />
                        )
                    }}

                    style={{
                        background: themeContext.bg.tertiary,
                        width: "3.5rem",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: "1rem",
                        borderBottomRightRadius: "1rem",
                        borderLeft: `1px solid ${themeContext.bg.quaternary}`,
                        borderBottom: `1px solid ${themeContext.bg.quinary}`,
                    }}
                />

            </styled.ItemContainer>
        </styled.ColumnContainer>
    );
};

MyComponent.propTypes = {

};

export default MyComponent;
