const Validator = require('../utilities/validator')
const moment = require('moment')



const loanRequest = async function(req, res) {

    try {

        const BorrowerData = req.body
        const tier1Cities = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad"]
        const tier2Cities = ["Mysore", "Hubli", "Dharwad", "Belgaum", "Shimoga"]
        const allCities = [...tier1Cities, ...tier2Cities]

        // User data is required
        if (!Validator.isValidInputData(BorrowerData)) {
            return res.status(400).send({ status: false, message: "User details are required" })
        }

        //using destructuring on BorrowerData
        let { Name, City, DOB, creditScore, loanAmount } = BorrowerData

        if (!Validator.isValidField(Name) || !Validator.isValidName(Name)) {
            return res.status(400).send({ status: false, message: "Name is required and should only contains alphabets" })
        }

        if (!Validator.isValidField(City) || !Validator.isValidName(City)) {
            return res.status(400).send({ status: false, message: "City is required and should only contains alphabets" })
        }

        // city must be from tier1 and tier2
        if (!allCities.includes(City)) {
            return res.status(400).send({ status: true, message: "Sorry, we do not provide service to this city" })
        }

        if (!Validator.isValidField(DOB)) {
            return res.status(400).send({ status: false, message: "DOB is required" })
        }

        // input date should be in 'YYYY-MM-DD' format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(DOB)) {
            return res.status(400).send({ status: false, message: "DOB should be in yyyy-mm-dd format" })
        }

        // using moment for date validation and checking DOB must not be greater than todays date
        if (!moment(new Date(DOB)).isValid() || moment().isBefore(new Date(DOB)) === true) {
            return res.status(400).send({ status: false, message: " Enter a valid date" })
        }

        // calculating age of user
        const age = (moment().diff(DOB, 'months')) / 12

        // if age is less than 18 or more than 59 then rejecting loan
        if (age < 18 || age > 59) {
            return res.status(400).send({ status: false, message: `Loan-Rejected : User age is ${age}, does not fulfilling the criteria` })
        }

        if (!Validator.isValidCreditScore(creditScore)) {
            return res.status(400).send({ status: false, message: "Credit score is required, should be an integer from 0 to 900" })
        }

        if (!Validator.isValidLoanAmount(loanAmount)) {
            return res.status(400).send({ status: false, message: "Loan amount is required, should be a multiple of 10000, range from 50000 to 500000" })
        }

        // Approval criteria checking

        // Declaring ROI
        let rateOfInterest

        // If city is tier1 and creditScore is below 300 then rejecting loan else calculating ROI
        if (tier1Cities.includes(City)) {
            if (creditScore < 300) {
                return res.status(400).send({ status: false, message: `Loan-Rejected : credit score- ${creditScore}, does not fulfilling the criteria` })
            } else if (creditScore <= 500 && creditScore >= 300) {
                rateOfInterest = 14
            } else if (creditScore <= 800 && creditScore > 500) {
                rateOfInterest = 12
            } else if (creditScore <= 900 && creditScore > 800) {
                rateOfInterest = 10
            }

            //If city is tier2 and creditScore is below 500 then rejecting loan else calculating ROI
        } else {
            if (creditScore < 500) {
                return res.status(200).send({ status: true, message: `Loan-Rejected : credit score- ${creditScore}, does not fulfilling the criteria` })
            } else if (creditScore <= 800 && creditScore > 500) {
                rateOfInterest = 13
            } else if (creditScore <= 900 && creditScore > 800) {
                rateOfInterest = 11
            }
        }

        const todaysDate = new Date().getDate()
        const todaysMonth = new Date().getMonth()
        const todaysYear = new Date().getFullYear()

        // declaring emi start date
        let emiStartDate

        // if date is not "1" then starting emi from next month 
        if (todaysDate === 1) {
            emiStartDate = moment()
        } else {
            emiStartDate = moment([todaysYear, todaysMonth, 01]).add(1, 'month')
        }

        // loan tenure is fixed i.e. 12Months
        const tenure = 12

        const principleComponent = Math.floor(loanAmount / tenure)

        // tenure is multiplied by 100 as ROI in %
        const interestComponent = Math.floor((rateOfInterest * loanAmount) / (tenure * 100))

        // creating emi bifurcation array for 12 months emi data
        const emiBifurcation = [{ Principle: principleComponent, Interest: interestComponent, Emi_Date: emiStartDate.format('DD-MM-YYYY') }]

        // iterating for loop to get next emi data and pushing same to emiBifurcation
        for (let i = 1; i < 12; i++) {
            emiBifurcation.push({ Principle: principleComponent, Interest: interestComponent, Emi_Date: moment(emiStartDate).add(i, 'month').format('DD-MM-YYYY') })
        }


        res.status(200).send({ status: true, message: "Loan-Approved", rateOfInterest: rateOfInterest, schedule: emiBifurcation })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

module.exports = { loanRequest }