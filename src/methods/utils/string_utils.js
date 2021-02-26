export const isString = (value) => {
    return (typeof value) === "string"
}

/*
* Are string1 and string2 equal (Case Insensitive)
* */
export const isEqualCI = (string1, string2) => {
    return string1.toLowerCase() === string2.toLowerCase();
}


