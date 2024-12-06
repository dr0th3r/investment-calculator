class InvestmentCalculator {
    constructor(
        startingAmountInput,
        additionalContributionInput,
        additionalContributionIntervalSelect,
        returnRateInput,
        compoundIntervalSelect,
        investmentPeriodInput,
        calculateButton,
        ouputElement,
    ) {
        this.startingAmountInput = startingAmountInput;
        this.additionalContributionInput = additionalContributionInput;
        this.additionalContributionIntervalSelect = additionalContributionIntervalSelect;
        this.returnRateInput = returnRateInput;
        this.compoundIntervalSelect = compoundIntervalSelect;
        this.investmentPeriodInput = investmentPeriodInput;
        this.calculateButton = calculateButton;
        this.ouputElement = ouputElement;

        this.result = 0;
    }

    init() {
        this.calculateButton.addEventListener('click', () => {
            this.recalculate();
            this.refreshOuput();
        })
    }

    recalculate() {
        this.result = parseInt(this.startingAmountInput.value);
        let date1 = new Date();
        date1.setMonth(date1.getMonth() + 1, 1);
        const date2 = new Date(date1);

        for (let i = 0; i < this.getComoundIntervalCount(date1); i++) {
            this.nextDate(date2);
            const additionalContribution = this.getAdditionalContributionCount(date1, date2);
            if (additionalContribution) {
                date1 = new Date(date2);
                this.result += additionalContribution * this.additionalContributionInput.value;     
            }

            this.result *= (1 + this.returnRateInput.value / 100);

            if (this.result == Infinity)
                break;
        }
    }

    refreshOuput() {
        if (this.result != Infinity)
            this.ouputElement.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.result);
        else
            this.ouputElement.innerHTML = `<img src="https://i.imgflip.com/65w66.jpg?a481440">`;
            // this.ouputElement.textContent = "Imagine you were born in a poor family, in a poor city, in a poor country, and by the time you were 28 years old, you have so much money you can't even count it. What do you do? You make your dreams come true.";
    }

    getDaysDifference(date1, date2) {
        const ms = date2 - date1; // difference between 2 dates in milliseconds

        // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
        return Math.floor(ms / (24 * 60 * 60 * 1000));
    }

    getWeeksDifference(date1, date2) {
        return Math.floor(this.getDaysDifference(date1, date2) / 7);
    }

    getMonthsDifference(date1, date2) {
        return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
    }

    getDaysInMonth(date) {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + 1, 0);
        return newDate.getDate();
    }

    // get compound interval count from the starting date
    getComoundIntervalCount(date1) {
        const investmentPeriod = parseInt(this.investmentPeriodInput.value);
        const date2 = new Date(date1);
        date2.setFullYear(date2.getFullYear() + investmentPeriod);

        switch (this.compoundIntervalSelect.value) {
            case 'anually':
                return investmentPeriod;
            case 'semianually':
                return investmentPeriod * 2;
            case 'quarterly':
                return investmentPeriod * 4;
            case 'monthly':
                return investmentPeriod * 12;
            case 'semimonthly':
                return investmentPeriod * 24;
            case 'biweekly':
                return Math.floor(this.getWeeksDifference(date1, date2) / 2);
            case 'weekly':
                return this.getWeeksDifference(date1, date2);
            case 'daily':
                return this.getDaysDifference(date1, date2);
        }
    }

    // updates currentDate to next one
    nextDate(currentDate) {
        switch (this.compoundIntervalSelect.value) {
            case 'anually':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            case 'semianually':
                currentDate.setMonth(currentDate.getMonth() + 6);
                break;
            case 'quarterly':
                currentDate.setMonth(currentDate.getMonth() + 3);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'semimonthly':
                if (currentDate.getDate() === 1) {
                    currentDate.setDate(Math.floor(this.getDaysInMonth(currentDate) / 2));
                } else {
                    currentDate.setMonth(currentDate.getMonth() + 1, 1);
                }
                break;
            case 'biweekly':
                currentDate.setDate(currentDate.getDate() + 14);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
        }
    }

    getAdditionalContributionCount(date1, date2) {
        switch (this.additionalContributionIntervalSelect.value) {
            case 'anually':
                return date2.getFullYear() - date1.getFullYear();
            case 'semianually':
                return Math.floor(this.getMonthsDifference(date1, date2) / 6);
            case 'quarterly':
                return Math.floor(this.getMonthsDifference(date1, date2) / 3);
            case 'monthly':
                return this.getMonthsDifference(date1, date2);
            case 'semimonthly':
                return this.getDaysDifference(date1, date2) / this.getDaysInMonth(date1); // date1 because it is the one previously updated
            case 'biweekly':
                return Math.floor(this.getWeeksDifference(date1, date2) / 2);
            case 'weekly':
                return this.getWeeksDifference(date1, date2);
            case 'daily':
                return this.getDaysDifference(date1, date2);
        }
    }
}

const calculator = new InvestmentCalculator(
    document.getElementById('starting-amount'),
    document.getElementById('additional-contribution'),
    document.getElementById('additional-contribution-interval'),
    document.getElementById('return-rate'),
    document.getElementById('compound-interval'),
    document.getElementById('investment-period'),
    document.getElementById('calculate'),
    document.getElementById('result'),
);
calculator.init();
