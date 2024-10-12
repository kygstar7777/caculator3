function calculate() {
    let initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000;
    let dividendYield = parseFloat(document.getElementById("dividendYield").value) / 100;
    let dividendGrowth = parseFloat(document.getElementById("dividendGrowth").value) / 100;
    let stockGrowth = parseFloat(document.getElementById("stockGrowth").value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000;
    let monthlyIncreaseRate = parseFloat(document.getElementById("monthlyIncreaseRate").value) / 100;
    let reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    let taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    let inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    let targetDividend = parseFloat(document.getElementById("targetDividend").value) * 10000;

    let tableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    let year = 1;
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let totalAssets = initialInvestment;
    let cumulativeInvestment = 0;
    let cumulativeDividends = 0;

    let annualDividends = initialInvestment * dividendYield * (1 - taxRate) * (1 - inflationRate);
    let reinvestedDividends = annualDividends * reinvestmentRate;

    while (annualDividends < targetDividend * 12) {
        // 테이블에 결과 추가
        let row = tableBody.insertRow();
        let cellYear = row.insertCell(0);
        let cellAnnualDividends = row.insertCell(1);
        let cellEndOfYearAssets = row.insertCell(2);
        let cellCumulativeInvestment = row.insertCell(3);
        let cellCumulativeDividends = row.insertCell(4);

        cellYear.innerHTML = year + "년";
        cellAnnualDividends.innerHTML = (annualDividends / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 만원";
        cellEndOfYearAssets.innerHTML = (totalAssets / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 만원";
        cellCumulativeInvestment.innerHTML = (cumulativeInvestment / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 만원";
        cellCumulativeDividends.innerHTML = (cumulativeDividends / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 만원";

        // 자산, 배당금, 재투자금 업데이트
        totalAssets = (totalAssets + reinvestedDividends) * (1 + stockGrowth);
        annualDividends = totalAssets * dividendYield * (1 - taxRate) * (1 - inflationRate) * (1 + dividendGrowth);
        reinvestedDividends = annualDividends * reinvestmentRate;

        cumulativeInvestment += monthlyInvestment * 12;
        cumulativeDividends += reinvestedDividends;

        monthlyInvestment *= (1 + monthlyIncreaseRate);
        year++;
    }

    document.getElementById("targetYear").innerHTML = "🔥 목표 달성 - " + (year - 1) + " 년";
}
