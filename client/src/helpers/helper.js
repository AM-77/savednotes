export const BASE_URL = "http://localhost:3300/sn-api"
// eslint-disable-next-line
export const validate_email = _email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(_email).toLowerCase())

export const validate_username = _username => /^[a-z0-9]+$/i.test(String(_username))

export const validate_password = (_password, _password_rules) => {
    let response = {}
    if (_password_rules.lowercase) response["lowercase"] = /[a-z]/.test(_password)
    if (_password_rules.uppercase) response["uppercase"] = /[A-Z]/.test(_password)
    if (_password_rules.numeric) response["numeric"] = /[0-9]/.test(_password)
    // eslint-disable-next-line
    if (_password_rules.symboles) response["symbols"] = /[~@#$%^&*+=`|{}:;!.?\"()\[\]-]/.test(_password)

    return response
}

export const format_date = date => {
    let d = new Date(date);
    if (d.toString() !== "Invalid Date") return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
    else return "Unknown Date"
}