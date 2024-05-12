const discordRegex =
  /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm
const twitterRegex = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/
const instagramRegex = /http(?:s)?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_-]+)/
const telegramRegex =
  /(https?:\/\/)?(?:www\.)?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/
const mediumRegex =
  /(https?:\/\/)?(?:www\.)?(medium)\.com\/(@?[a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]*)$/g
const websiteRegex =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
const facebookRegex =
  /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/gi

const checkUrl = (url, type) => {
  switch (type) {
    case "discord":
      return discordRegex.test(url)
    case "twitter":
      return twitterRegex.test(url)
    case "telegram":
      return telegramRegex.test(url)
    case "medium":
      return mediumRegex.test(url)
    case "website":
      return websiteRegex.test(url)
    case "facebook":
      return url.match(facebookRegex)
    case "instagram":
      return instagramRegex.test(url)
    default:
      return false
  }
}

const urlPattern =
    /^(http|https):\/\/([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-_./?%&=]*)?$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (name, value, arr) => {
  if (emailPattern.test(value)) return;
  arr.push(`${name} is Invalid`);
};

const validateUrl = (name, value, arr) => {
  if (urlPattern.test(value)) return;
  arr.push(`${name} is Invalid`);
};

/**
   * Validates a numeric value based on a specified condition.
   *
   * @param {string} name - The name or identifier of the numeric value being validated.
   * @param {string} value - The numeric value to be validated.
   * @param {Array<string>} arr - An array of numeric values used for comparison or validation conditions.
   * @param {"phone" | "postal"} type - An optional parameter indicating the type or condition for validation.
   *
   * @returns {void}
   */
const numberValidator = (name, value, arr, type) => {
  if (type === "phone") {
    const strVal = String(value).trim();
    const result = strVal.replace(/^0+/, "").replace(/\s+/g, "");
    if (result.length !== 10) return arr.push(`${name} is Invalid`);
  } else if (type === "postal") {
    const strVal = String(value).trim();
    const result = strVal.replace(/^0+/, "").replace(/\s+/g, "");
    if (result.length < 6) return arr.push(`${name} is Invalid`);
  }
};

const strDoesExist = (name, value, arr, err = "is Invalid") => {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    Number(value) === 0
  ) {
    arr.push(`${name} ${err}`);
  }
};


module.exports = {
  checkUrl,
  urlPattern,
  emailPattern,
  validateEmail,
  validateUrl,
  numberValidator,
  strDoesExist
}