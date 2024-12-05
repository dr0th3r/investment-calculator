class InvestmentCalculator {
    constructor(
        startingAmountInput,
        additionalContributionInput,
        additionalContributiionIntervalSelect,
        returnRateInput,
        compoundIntervalSelect,
        investmentPeriodInput,
        calculateButton,
        ouputElement,
    ) {
        this.startingAmountInput = startingAmountInput;
        this.additionalContributionInput = additionalContributionInput;
        this.additionalContributiionIntervalSelect = additionalContributiionIntervalSelect;
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

        console.log(this.result);
        
        switch (this.compoundIntervalSelect.value) {
            case 'anually':
                let date2 = new Date(date1);
                for (let i = 0; i < this.investmentPeriodInput.value; i++) {
                    date2.setFullYear(date2.getFullYear() + 1);

                    const additionalContribution = this.getAdditionalContributionCount(date1, date2) * this.additionalContributionInput.value;

                    if (additionalContribution > 0) {
                        date1 = new Date(date2);
                        this.result += additionalContribution;
                        this.result *= (1 + this.returnRateInput.value / 100);

                        console.log(this.result);
                    }
                }

                break;
        }
    }

    refreshOuput() {
        this.ouputElement.textContent = this.result;
    }

    getAdditionalContributionCount(date1, date2) {
        switch (this.additionalContributiionIntervalSelect.value) {
            case 'anually':
                return date2.getFullYear() - date1.getFullYear();
        }
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