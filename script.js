// 계산 버튼을 클릭하면 계산 함수 실행
document.getElementById('calculateButton').addEventListener('click', calculate);

function calculate() {
    // 입력된 값을 불러와서 변수에 저장 (만원 단위는 10000으로 변환)
    let initialInvestment = parseFloat(document.getElementById('initialInvestment').value) * 10000; // 초기 투자금
    let dividendRate = parseFloat(document.getElementById('    dividendRate').value) / 100; // 배당률
    let dividendGrowthRate = parseFloat(document.getElementById('dividendGrowthRate').value) / 100; // 배당 성장률
    let stockGrowthRate = parseFloat(document.getElementById('stockGrowthRate').value) / 100; // 주가 상승률
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 월 투자금
    let monthlyInvestmentGrowthRate = parseFloat(document.getElementById('monthlyInvestmentGrowthRate').value) / 100; // 월 투자금 증가율
    let reinvestmentRate = parseFloat(document.getElementById('reinvestmentRate').value) / 100; // 배당금 재투자율
    let taxRate = parseFloat(document.getElementById('taxRate').value) / 100; // 세율
    let inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100; // 인플레이션
    let targetMonthlyDividend = parseFloat(document.getElementById('targetMonthlyDividend').value) * 10000; // 목표 월 배당금

    // 계산 결과를 저장할 배열 선언
    let results = [];
    let year = 1; // 현재 연차 (1년차부터 시작)
    let totalInvestment = initialInvestment; // 총 투자금 (누적)
    let totalReinvestedDividends = 0; // 총 재투자 배당금 (누적)
    let totalAssets = initialInvestment; // 총 자산 (초기 투자금으로 시작)
    let currentDividend = initialInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate) * reinvestmentRate; // 초기 투자금으로 계산된 배당금

    // 목표 월 배당금에 도달할 때까지 계산
    while ((currentDividend / 12) < targetMonthlyDividend) {
        // 연간 투자금 및 배당금 계산
        let annualInvestment = monthlyInvestment * 12; // 매년 투자되는 금액
        let annualDividendsFromInvestment = (monthlyInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate)) * 12; // 월 투자금에 대한 연간 배당금
        let annualDividends = currentDividend + annualDividendsFromInvestment; // 총 연간 배당금
        totalReinvestedDividends += annualDividends * reinvestmentRate; // 배당금 재투자 금액 계산
        totalInvestment += annualInvestment; // 누적 투자금 계산
        totalAssets = (totalInvestment + totalReinvestedDividends) * (1 + stockGrowthRate); // 주가 상승률을 반영한 총 자산

        // 계산 결과를 배열에 저장
        results.push({
            year: year,
            yearStartDividend: currentDividend / 10000, // 연초 배당금 (만원 단위)
            yearEndAssets: totalAssets / 10000, // 연말 자산 (만원 단위)
            cumulativeInvestment: totalInvestment / 10000, // 누적 투자 (만원 단위)
            cumulativeReinvestedDividends: totalReinvestedDividends / 10000 // 누적 재투자 배당금 (만원 단위)
        });

        // 다음 연도 배당금 계산 (배당 성장률 반영)
        currentDividend = (totalInvestment + totalReinvestedDividends) * dividendRate * (1 - taxRate) * (1 - inflationRate) * (1 + dividendGrowthRate) * reinvestmentRate;
        monthlyInvestment *= (1 + monthlyInvestmentGrowthRate); // 매월 투자금 증가율 반영
        year++; // 연도 증가
    }

    // 계산된 결과를 화면에 출력
    displayResults(results, targetMonthlyDividend / 10000, year);
}

// 계산된 결과를 화면에 표시하는 함수
function displayResults(results, targetMonthlyDividend, yearsTaken) {
    let tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = ''; // 기존 테이블 데이터 초기화

    // 계산된 결과를 테이블에 추가
    results.forEach(result => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.year} 년</td>
            <td>${Math.floor(result.yearEndDividend).toLocaleString()} 만원</td>
            <td>${Math.floor(result.yearEndAssets).toLocaleString()} 만원</td>
            <td>${Math.floor(result.cumulativeInvestment).toLocaleString()} 만원</td>
            <td>${Math.floor(result.cumulativeReinvestedDividends).toLocaleString()} 만원</td>
        `;
        tbody.appendChild(row);
    });

    // 결과 메시지 출력 (목표 달성 연도 포함)
    document.getElementById('resultMessage').textContent = `${yearsTaken} 년 후 목표 월 배당금에 도달합니다.`;
}
