import {SORT_MODES} from "../../constants/common_contants";
import {convertCardDate} from "./card_utils";
import {deepCopy} from "./utils";


export const isArray = (arr) => {
	return ((typeof arr !== 'undefined') && Array.isArray(arr))
}

export const removeArrayIndices = (arr, indices) => {
	let arrCopy = [...arr]

	for (var i = indices.length - 1; i >= 0; i--)
		arrCopy.splice(indices[i],1);

	return arrCopy
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
