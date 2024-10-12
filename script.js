document.getElementById('calculateButton').addEventListener('click', calculate);

function calculate() {
    // 만원 단위 -> 원 단위로 변환
    let initialInvestment = parseFloat(document.getElementById('initialInvestment').value) * 10000;
    let dividendRate = parseFloat(document.getElementById('dividendRate').value) / 100;
    let dividendGrowthRate = parseFloat(document.getElementById('dividendGrowthRate').value) / 100;
    let stockGrowthRate = parseFloat(document.getElementById('stockGrowthRate').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000;
    let monthlyInvestmentGrowthRate = parseFloat(document.getElementById('monthlyInvestmentGrowthRate').value) / 100;
    let reinvestmentRate = parseFloat(document.getElementById('reinvestmentRate').value) / 100;
    let taxRate = parseFloat(document.getElementById('taxRate').value) / 100;
    let inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    let targetMonthlyDividend = parseFloat(document.getElementById('targetMonthlyDividend').value) * 10000;

    let results = [];
    let year = 1;
    let totalInvestment = initialInvestment;
    let totalReinvestedDividends = 0;
    let totalAssets = initialInvestment;
    let currentDividend = totalInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate);

    // 연초 배당금으로 목표 월 배당금까지 계산
    while ((currentDividend / 12) < targetMonthlyDividend) {
        let annualInvestment = monthlyInvestment * 12;
        let annualDividendsFromInvestment = annualInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate);
        let annualDividends = currentDividend + annualDividendsFromInvestment;
        totalReinvestedDividends += annualDividends * reinvestmentRate;
        totalInvestment += annualInvestment;
        totalAssets = (totalInvestment + totalReinvestedDividends) * (1 + stockGrowthRate);

        // 결과 저장 (연초 배당금으로 계산)
        results.push({
            year: year,
            yearStartDividend: currentDividend / 10000, // 연초 배당금 (만원 단위)
            yearEndAssets: totalAssets / 10000, // 연말 자산 (만원 단위)
            cumulativeInvestment: totalInvestment / 10000, // 누적 투자 (만원 단위)
            cumulativeReinvestedDividends: totalReinvestedDividends / 10000 // 누적 재투자 배당금 (만원 단위)
        });

        // 다음 해 배당금 계산 (배당 성장률 반영)
        currentDividend = (totalInvestment + totalReinvestedDividends) * dividendRate * (1 - taxRate) * (1 - inflationRate);
        monthlyInvestment *= (1 + monthlyInvestmentGrowthRate);
        year++;
    }

    displayResults(results, targetMonthlyDividend / 10000, year);
}

// 결과 출력 함수
function displayResults(results, targetMonthlyDividend, yearsTaken) {
    let tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = '';

    results.forEach(result => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.year} 년</td>
            <td>${Math.floor(result.yearStartDividend).toLocaleString()} 만원</td>
            <td>${Math.floor(result.yearEndAssets).toLocaleString()} 만원</td>
            <td>${Math.floor(result.cumulativeInvestment).toLocaleString()} 만원</td>
            <td>${Math.floor(result.cumulativeReinvestedDividends).toLocaleString()} 만원</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('resultMessage').textContent = `${yearsTaken} 년 후 목표 월 배당금에 도달합니다.`;
}
