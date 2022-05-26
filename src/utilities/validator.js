const isValidInputData = function(object) {
    return Object.keys(object).length > 0
}

const isValidField = function(value) {
    if (typeof value === "string" && value.trim().length > 0) return true
}

const isValidName = function(value) {
    if (/^[A-Za-z]+$/.test(value) === true) return true
}


const isValidCreditScore = function(value) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 900) {
        return true
    }
}

const isValidLoanAmount = function(value) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 50000 && value <= 500000 && value % 10000 === 0) {
        return true
    }
}

module.exports = {
    isValidInputData,
    isValidLoanAmount,
    isValidCreditScore,
    isValidName,
    isValidField

}