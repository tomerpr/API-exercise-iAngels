async function getStocksDataFromApi(companySymbol){
    return await Promise.resolve($.ajax({
        type: "GET",
        url: `https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=${companySymbol}&region=US`,
        headers: {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "f0767d29e3mshdfcfac3829e4077p19297fjsn9f1b868a72c5"
        },
        error: function(err) {}
    }));
};

function createTableData(){
    return {
        tableRow: document.createElement("tr"),
        symbolTd: document.createElement("td"),
        shortNameTd: document.createElement("td"),
        sectorTd: document.createElement("td"),
        stockValueTd: document.createElement("td"),
        profitMarginsTd: document.createElement("td"),
        lastQuarterEarningsTd: document.createElement("td"),
        deleteButtonTd: document.createElement("button")
    }
}

function editTableData(tableRowObj, dataObj){
    const {symbolTd, shortNameTd, sectorTd, stockValueTd, profitMarginsTd, lastQuarterEarningsTd, deleteButtonTd} = tableRowObj

    // # official company's symbol
    const {symbol} = dataObj
    symbolTd.innerHTML = symbol

    // # official short-name
    const {shortName} = dataObj.price
    shortNameTd.innerHTML = shortName

    // # company's sector
    const {sector} = dataObj.summaryProfile
    sectorTd.innerHTML = sector

    // # formatted current stock value
    const {currentPrice} = dataObj.financialData
    stockValueTd.innerHTML = "$" + currentPrice.fmt

    // # company's current profit margin
    const {profitMargins} = dataObj.defaultKeyStatistics
    profitMarginsTd.innerHTML = profitMargins.fmt

    // # long-formatted last quarter's earnings
    const quarterlyData = dataObj.earnings.financialsChart.quarterly
    let {longFmt} = quarterlyData[quarterlyData.length - 1].earnings
    let numPrefix = "$"
    if (longFmt[0] == "-"){
        longFmt = longFmt.slice(1)
        numPrefix = "-$"
    }
    lastQuarterEarningsTd.innerHTML = numPrefix + longFmt
    
    // # delete button 
    deleteButtonTd.classList.add('btn', 'btn-danger', 'buttonStyle', 'deleteBtn')
    deleteButtonTd.style.color = "black"
    deleteButtonTd.innerHTML = "x"
}

function appendTableData(tableRowObj){
    const {tableRow, symbolTd, shortNameTd, sectorTd, stockValueTd, profitMarginsTd, lastQuarterEarningsTd, deleteButtonTd} = tableRowObj
    const tableBody = document.getElementById("tableBody")
    tableRow.append(symbolTd, shortNameTd, sectorTd, stockValueTd, profitMarginsTd, lastQuarterEarningsTd, deleteButtonTd)
    tableBody.append(tableRow)
}

async function draw(companySymbol){
    const addField = document.getElementById("addField")
    if(!companySymbol && !addField.value){
        return alert("You must insert a valid value!")
    }
    companySymbol = companySymbol || addField.value
    const tableData = createTableData()
    const returnedData = await getStocksDataFromApi(companySymbol)
    editTableData(tableData, returnedData)
    appendTableData(tableData)
    addField.value=""
}

function init(){
    const staticInitSymbolsList = ["ARBE", "FB", "GOOGL", "NDAQ"] // Arbe, Facebook, Google, S&P 500 - as initial values required
    for(let i = 0; i < staticInitSymbolsList.length; i++){
        draw(staticInitSymbolsList[i])
    }
}

$("#myTable").on('click', '.deleteBtn', function(){
    $(this).parent().remove();
})

init()