// 계산 버튼 클릭 시 계산 함수 실행
document.getElementById('calculateButton').addEventListener('click', calculate);

function calculate() {
    // 입력된 값을 불러와서 변수에 저장 (만원 단위는 10000으로 변환)
    // 초기 투자금 (만원 단위로 입력된 값을 원 단위로 변환)
    let initialInvestment = parseFloat(document.getElementById('initialInvestment').value) * 10000; 

    // 배당률 (백분율로 입력된 값을 소수로 변환)
    let dividendRate = parseFloat(document.getElementById('dividendRate').value) / 100; 

    // 배당 성장률 (백분율로 입력된 값을 소수로 변환)
    let dividendGrowthRate = parseFloat(document.getElementById('dividendGrowthRate').value) / 100; 

    // 주가 상승률 (백분율로 입력된 값을 소수로 변환)
    let stockGrowthRate = parseFloat(document.getElementById('stockGrowthRate').value) / 100; 

    // 월 투자금 (만원 단위로 입력된 값을 원 단위로 변환)
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; 

    // 월 투자금 증가율 (백분율로 입력된 값을 소수로 변환)
    let monthlyInvestmentGrowthRate = parseFloat(document.getElementById('monthlyInvestmentGrowthRate').value) / 100; 

    // 배당금 재투자율 (백분율로 입력된 값을 소수로 변환)
    let reinvestmentRate = parseFloat(document.getElementById('reinvestmentRate').value) / 100; 

    // 세율 (백분율로 입력된 값을 소수로 변환)
    let taxRate = parseFloat(document.getElementById('taxRate').value) / 100; 

    // 인플레이션 (백분율로 입력된 값을 소수로 변환)
    let inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100; 

    // 목표 월 배당금 (만원 단위로 입력된 값을 원 단위로 변환)
    let targetMonthlyDividend = parseFloat(document.getElementById('targetMonthlyDividend').value) * 10000; 

    // 결과를 저장할 배열 선언
    let results = [];
    let year = 1; // 현재 연차 (1년차부터 시작)
    
    // 초기 투자금으로 시작하는 총 투자금
    let totalInvestment = initialInvestment; 

    // 총 재투자 배당금 (누적)
    let totalReinvestedDividends = 0; 

    // 초기 자산 (초기 투자금으로 시작)
    let totalAssets = initialInvestment; 

    // 초기 배당금 (초기 투자금으로 계산된 배당금)
    let currentDividend = totalInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate); 

    // 목표 월 배당금에 도달할 때까지 반복
    while ((currentDividend / 12) < targetMonthlyDividend) {
        // 연간 투자금 계산
        let annualInvestment = monthlyInvestment * 12; // 매년 투자되는 금액

        // 연간 배당금 계산 (월 투자금에 대한 배당금)
        let annualDividendsFromInvestment = annualInvestment * dividendRate * (1 - taxRate) * (1 - inflationRate); 

        // 총 연간 배당금
        let annualDividends = currentDividend + annualDividendsFromInvestment; 

        // 재투자 배당금 계산
        totalReinvestedDividends += annualDividends * reinvestmentRate; 

        // 누적 투자금 업데이트
        totalInvestment += annualInvestment; 

        // 주가 상승률을 반영한 총 자산 계산
        totalAssets = (totalInvestment + totalReinvestedDividends) * (1 + stockGrowthRate); 

        // 계산된 결과를 배열에 저장
        results.push({
            year: year, // 연도
            yearStartDividend: currentDividend / 10000, // 연초 배당금 (만원 단위)
            yearEndAssets: totalAssets / 10000, // 연말 자산 (만원 단위)
            cumulativeInvestment: totalInvestment / 10000, // 누적 투자 (만원 단위)
            cumulativeReinvestedDividends: totalReinvestedDividends / 10000 // 누적 재투자 배당금 (만원 단위)
        });

        // 2년 차 연초 배당금 계산 (1년 차의 배당금에 배당 성장률 적용)
        currentDividend *= (1 + dividendGrowthRate); // 첫 해 배당금에 성장률 적용
        
        // 매월 투자금에 대한 배당금 계산에 배당 성장률 반영
        annualDividendsFromInvestment *= (1 + dividendGrowthRate); // 배당 성장률 적용
        
        // 매월 투자금 증가율 반영
        monthlyInvestment *= (1 + monthlyInvestmentGrowthRate); 
        
        year++; // 연도 증가
    }

    // 계산된 결과를 화면에 출력
    displayResults(results, targetMonthlyDividend / 10000, year);
}

// 계산된 결과를 화면에 표시하는 함수
function displayResults(results, targetMonthlyDividend, yearsTaken) {
    // 결과 테이블의 tbody 요소 선택
    let tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = ''; // 기존 테이블 데이터 초기화

    // 계산된 결과를 테이블에 추가
    results.forEach(result => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td title="년수">${result.year} 년</td>
            <td title="연초 배당금 (만원)">${Math.floor(result.yearStartDividend).toLocaleString()} 만원</td>
            <td title="연말 자산 (만원)">${Math.floor(result.yearEndAssets).toLocaleString()} 만원</td>
            <td title="누적 투자 (만원)">${Math.floor(result.cumulativeInvestment).toLocaleString()} 만원</td>
            <td title="누적 재투자 배당금 (만원)">${Math.floor(result.cumulativeReinvestedDividends).toLocaleString()} 만원</td>
        `;
        tbody.appendChild(row); // 새로운 행을 테이블에 추가
    });

    // 결과 메시지 출력 (목표 달성 연도 포함)
    document.getElementById('resultMessage').textContent = `${yearsTaken} 년 후 목표 월 배당금에 도달합니다.`;
}
