document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'dab3c7745160e4fb71be40e4';
    const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

    const getCurrencyOptions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/codes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            console.log('Currency options JSON:', json);
            return json.supported_codes.map(code => ({ code: code[0], description: code[1] }));
        } catch (error) {
            console.error('Error fetching currency options:', error);
            return null; // Return null to indicate failure
        }
    };

    const getCurrencyRate = async (fromCurrency, toCurrency) => {
        try {
            const response = await fetch(`${BASE_URL}/pair/${fromCurrency}/${toCurrency}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return json.conversion_rate;
        } catch (error) {
            console.error('Error fetching currency rate:', error);
            return null; // Return null to indicate failure
        }
    };

    const appendOptionToSelect = (selectElement, optionItem) => {
        const optionElement = document.createElement('option');
        optionElement.value = optionItem.code;
        optionElement.textContent = optionItem.description;
        selectElement.appendChild(optionElement);
    };

    const populateSelectElement = (selectElement, optionList) => {
        optionList.forEach(optionItem => {
            appendOptionToSelect(selectElement, optionItem);
        });
    };

    const setupCurrencies = async () => {
        const fromCurrencyElem = document.getElementById('fromCurrency');
        const toCurrencyElem = document.getElementById('toCurrency');

        const currencyOptions = await getCurrencyOptions();

        if (!currencyOptions) {
            console.error('Failed to load currency options');
            return;
        }

        const currencies = currencyOptions.map(currency => ({ code: currency.code, description: currency.description }));

        populateSelectElement(fromCurrencyElem, currencies);
        populateSelectElement(toCurrencyElem, currencies);
    };

    setupCurrencies();

    const setupEventListener = () => {
        const formElement = document.getElementById('convertForm');

        formElement.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fromCurrency = document.getElementById('fromCurrency');
            const toCurrency = document.getElementById('toCurrency');
            const amount = document.getElementById('amount');
            const convertResultElem = document.getElementById('convertResult');
            try {

                const rate = await getCurrencyRate(fromCurrency.value, toCurrency.value);
                const amountValue = Number(amount.value);
                const conversionResult = Number(amountValue * rate).toFixed(2);
                convertResultElem.textContent = `${amountValue} ${fromCurrency.value} = ${conversionResult} ${toCurrency.value}`;
            } catch(error) {
                convertResultElem.textContent = `There was an error getting conversion rate [${error.message}]`
                convertResultElem.classList.add('error')
            }
        });
    };

    setupEventListener();
});
