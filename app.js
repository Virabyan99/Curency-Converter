const getCurrencyOptions = async () => {
    const response = await fetch('https://api.exchangerate.host/symbols')
    
    
    const json = await response.json();
    
    return json.symbols;
}

const getCurrencyRate = async (fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert')

    currencyConvertUrl.searchParams.append('from, fromCurrency')
    currencyConvertUrl.searchParams.append('to, toCurrency')

    const response = await fetch(currencyConvertUrl);
    const json =   await response.json()

    return json.result;
};

const appendOptionToSelect = (selectElement, optionItem) => {
    const optionElement = document.createElement('option')
    optionElement.value = optionItem.code;
    optionElement.textContent = optionItem.description;
    selectElement.appendChild(optionElement)
}

const populateSelectElement = (selectElement, optionList) => {
    optionList.forEach(optionItem => {
        appendOptionToSelect(selectElement, optionItem);
    })
}

const setupCurrencies = async () => {
    const fromCurrencyElem = document.getElementById('fromCurrency');
    const toCurrencyElem = document.getElementById('toCurrency');

    const currencyOptions = await getCurrencyOptions();

    const currencies = Object.keys(currencyOptions).map(currencyKey => currencyOptions[currencyKey])

    populateSelectElement(fromCurrencyElem, currencies);
    populateSelectElement(toCurrencyElem, currencies);
}

setupCurrencies()