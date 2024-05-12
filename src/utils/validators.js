export const urlPattern =
  /^(http|https):\/\/([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-./?%&=]*)?$/

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Validates a numeric value based on a specified condition.
 *
 * @param {string} name 
 * @param {string} value 
 * @param {Array<string>} arr
 *
 * @returns {void}
 */
export const validateUrl = (name, value, arr) => {
  if (urlPattern.test(value)) return
  arr.push(`${name} is Invalid`)
}

/**
 * Validates a numeric value based on a specified condition.
 *
 * @param {string} name
 * @param {string} value 
 * @param {Array<string>} arr
 *
 * @returns {void}
 */
export const validateEmail = (name, value, arr) => {
  if (emailPattern.test(value)) return
  arr.push(`${name} is Invalid`)
}

/**
 * Validates a numeric value based on a specified condition.
 *
 * @param {string} name
 * @param {string} value 
 * @param {Array<string>} arr
 * @param {"phone" | "postal"} type - An optional parameter indicating the type or condition for validation.
 *
 * @returns {void}
 */
export const numberValidator = (name, value, arr, type) => {
  if (type === "phone") {
    const strVal = String(value).trim()
    const result = strVal.replace(/^0+/, "").replace(/\s+/g, "")
    if (result.length !== 10) return arr.push(`${name} is Invalid`)
  } else if (type === "postal") {
    const strVal = String(value).trim()
    const result = strVal.replace(/^0+/, "").replace(/\s+/g, "")
    if (result.length < 6) return arr.push(`${name} is Invalid`)
  }
}

/**
 * Validates a numeric value based on a specified condition.
 *
 * @param {string} name
 * @param {string} value 
 * @param {Array<string>} arr
 * @param {any} err - An optional parameter indicating the type or condition for validation.
 *
 * @returns {void}
 */
export const strDoesExist = (name, value, arr, err = "is Invalid") => {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    Number(value) === 0
  ) {
    arr.push(`${name} ${err}`)
  }
}
