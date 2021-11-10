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
        stockValueTd: document.createElement("td"),
        lastQuarterEarningsTd: document.createElement("td"),
        deleteButtonTd: document.createElement("button")
    }
}

function editTableData(tableRowObj, dataObj){
    const {symbolTd, shortNameTd, stockValueTd, lastQuarterEarningsTd, deleteButtonTd, } = tableRowObj

    const {symbol} = dataObj
    symbolTd.innerHTML = symbol

    const {shortName} = dataObj.price
    shortNameTd.innerHTML = shortName

    const {fmt} = dataObj.financialData.currentPrice
    stockValueTd.innerHTML = fmt

    const quarterlyData = dataObj.earnings.financialsChart.quarterly
    const {longFmt} = quarterlyData[quarterlyData.length - 1].earnings
    lastQuarterEarningsTd.innerHTML = longFmt
    
    deleteButtonTd.classList.add('btn', 'btn-danger', 'buttonStyle')
    deleteButtonTd.innerHTML = "x"
}

function appendTableData(tableRowObj){
    const {tableRow, symbolTd, shortNameTd, stockValueTd, lastQuarterEarningsTd, deleteButtonTd} = tableRowObj
    const tableBody = document.getElementById("tableBody")
    tableRow.append(symbolTd, shortNameTd, stockValueTd, lastQuarterEarningsTd, deleteButtonTd)
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
    const staticInitSymbolsList = ["ARBE"]//, "FB", "GOOGL", "NDAQ"] // Arbe, Facebook, Google, S&P 500
    for(let i = 0; i < staticInitSymbolsList.length; i++){
        draw(staticInitSymbolsList[i])
    }
}

init()