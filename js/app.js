const CHART_UNIT = 'GB';

class ChartUIManager {
    constructor(chartElementId, monthsContainerSelector, chartLegendSelector) {
        this.chartElement = document.getElementById(chartElementId);
        this.monthsWrapper = document.querySelector(monthsContainerSelector);
        this.chartLegendWrapper = document.querySelector(chartLegendSelector);
        this.monthsContainer = this.monthsWrapper.querySelector('.slider-wrapper');

        this.chart = null;
        this.init();
    }

    init() {
        this.renderMonthButtons();
        this.initializeChart();
        this.selectInitialMonth();
    }

    renderMonthButtons() {
        const lastMonths = ChartDataGenerator.generateLastMonths(24);
        const monthsHtml = lastMonths
            .map(
                ({ month, year }) =>
                    `<button class="button" data-month="${month}" data-year="${year}">${month}, ${year}</button>`,
            )
            .join('');

        if (this.monthsContainer) {
            this.monthsContainer.innerHTML = monthsHtml;
            this.attachButtonListeners();
            new Slider('.chart-months .slider-container');
        }
    }

    attachButtonListeners() {
        const buttons = this.monthsContainer.querySelectorAll('.button');
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => this.handleMonthClick(e));
        });
    }

    handleMonthClick(e) {
        const { month, year } = e.target.dataset;
        this.updateActiveButton(e.target);
        const chartData = ChartDataGenerator.generateChartData(2, month, year);
        this.updateChart(chartData);
    }

    updateActiveButton(clickedButton) {
        const activeButton = this.monthsContainer.querySelector('.button.active');
        if (activeButton) {
            activeButton.classList.remove('active');
        }
        clickedButton.classList.add('active');
    }

    initializeChart() {
        if (!this.chartElement) return;

        this.chart = new Chart(this.chartElement, {
            type: 'line',
            data: {},
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += `${context.parsed.y} ${CHART_UNIT}`;
                                }
                                return label;
                            },
                        },
                    },
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                    },
                    x: {
                        grid: { display: false },
                    },
                },
            },
        });
    }

    updateLegend(chartData) {
        let html = '';
        chartData.datasets.forEach((dataset) => {
            const total = dataset.data.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
            html += `
                <div class="legend-item">
                    <div class="legend-item__label">${dataset.label}</div>
                    <div class="legend-item__value" style="color:${dataset.borderColor}">${total} ${CHART_UNIT}</div>
                </div>
            `;
        });
        this.chartLegendWrapper.innerHTML = html;
    }

    updateChart(chartData) {
        if (this.chart) {
            this.chart.data = chartData;
            this.chart.update();
            this.updateLegend(chartData);
        }
    }

    selectInitialMonth() {
        const lastMonthButton = this.monthsContainer?.querySelector('.button:first-child');
        lastMonthButton?.click();
    }
}



document.addEventListener('DOMContentLoaded', () => {
    new ChartUIManager('chart', '.chart-months', '.chart-legend');
});
