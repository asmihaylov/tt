const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth = (year, month) => {
    const date = new Date(year, MONTHS.indexOf(month));
    return new Date(year, date.getMonth() + 1, 0).getDate();
};

const getRandomValue = () => Math.floor(Math.random() * 1000) + 1;

class ChartDataGenerator {
    static generateChartData(numCharts, month, year) {
        if (!month || !year || numCharts <= 0) {
            throw new Error('Invalid input parameters');
        }

        const daysInMonth = getDaysInMonth(year, month);

        return {
            labels: this.generateLabels(daysInMonth, month),
            datasets: this.generateDatasets(numCharts, daysInMonth),
        };
    }

    static generateLabels(daysInMonth, month) {
        return Array.from({ length: daysInMonth }, (_, i) => `${i + 1} ${month}`);
    }

    static generateDatasets(numCharts, daysInMonth) {
        return Array.from({ length: numCharts }, (_, i) => ({
            label: `Chart ${i + 1}`,
            data: Array.from({ length: daysInMonth }, getRandomValue),
            borderWidth: 3,
            pointRadius: 0,
            borderColor: `hsl(${(360 / numCharts) * i}, 25%, 50%)`,
        }));
    }

    static generateLastMonths(numberOfMonths) {
        const result = [];
        const currentDate = new Date();

        for (let i = 0; i < numberOfMonths; i++) {
            const monthIndex = currentDate.getMonth();
            const year = currentDate.getFullYear();

            result.unshift({
                month: MONTHS[monthIndex],
                year,
            });

            currentDate.setMonth(monthIndex - 1);
        }

        return result;
    }
}
