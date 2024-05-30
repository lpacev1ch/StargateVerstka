function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}




    //1

async function fetchCurrencyRates() {
    const rateDate = document.getElementById('rateDate').value;
    if (!rateDate) {
        alert('Пожалуйста, выберите дату');
        return;
    }

    const url = `https://www.nbrb.by/api/exrates/rates?ondate=${rateDate}&periodicity=0`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert(`Ошибка при получении данных: ${response.status}`);
            return;
        }
        const data = await response.json();

        const rateList = document.getElementById('rateList');
        if (!rateList) {
            alert('Элемент rateList не найден на странице');
            return;
        }
        rateList.innerHTML = '';

        if (data.length === 0) {
            alert('Нет данных о курсах валют для выбранной даты');
            return;
        }

        data.forEach(rate => {
            const listItem = document.createElement('li');
            listItem.textContent = `${rate.Cur_Abbreviation}: ${rate.Cur_OfficialRate} BYN`;
            rateList.appendChild(listItem);
        });

        document.getElementById('message').textContent = '';
    } catch (error) {
      document.getElementById('message').textContent(`Ошибка при получении курсов валют: ${error.message}`);
    }
}




    //2

async function fetchCurrencyDynamics() {
    const dynamicFromDate = document.getElementById('dynamicFromDate').value;
    const dynamicToDate = document.getElementById('dynamicToDate').value;
    const currencyCode = document.getElementById('currencyCode').value.toUpperCase();

    if (!dynamicFromDate || !dynamicToDate || !currencyCode) {
        alert('Пожалуйста, заполните все необходимые поля.');
        return;
    }

    try {
        const url = `https://www.nbrb.by/api/exrates/rates/dynamics/${currencyCode}?startDate=${dynamicFromDate}&endDate=${dynamicToDate}`;
        const response = await fetch(url);
        if (!response.ok) {
            alert(`Ошибка при получении динамики валюты: ${response.status}`);
            return;
        }

        const dynamicData = await response.json();
        if (dynamicData.length === 0) {
            alert('Данные по выбранному периоду не найдены.');
            return;
        }

        let dynamicTable = `
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Курс</th>
                </tr>
              </thead>
              <tbody>
        `;

        dynamicData.forEach(item => {
            dynamicTable += `
              <tr>
                <td>${item.Date.slice(0, 10)}</td>
                <td>${item.Cur_OfficialRate.toFixed(2)} BYN</td>
              </tr>
            `;
        });

        dynamicTable += `
              </tbody>
            </table>
        `;

        document.getElementById('dynamicList').innerHTML = dynamicTable;
    } catch (error) {
        alert(`Ошибка при получении динамики валюты: ${error.message}`);
    }
}





    //3

async function convertCurrency() {
    const currencyFrom = document.getElementById('currencyFrom').value.toUpperCase();
    const currencyTo = document.getElementById('currencyTo').value.toUpperCase();
    const amountFrom = parseFloat(document.getElementById('amountFrom').value);

    if (!currencyFrom || !currencyTo || isNaN(amountFrom) || amountFrom <= 0) {
        alert('Пожалуйста, заполните все необходимые поля.');
        return;
    }

    try {
        const url = `https://www.nbrb.by/api/exrates/rates?periodicity=0&ondate=${new Date().toISOString().slice(0, 10)}`;
        const response = await fetch(url);
        if (!response.ok) {
            alert(`Ошибка при получении курсов валют: ${response.status}`);
            return;
        }

        const rates = await response.json();
        const fromRate = rates.find(rate => rate.Cur_Abbreviation === currencyFrom);
        const toRate = rates.find(rate => rate.Cur_Abbreviation === currencyTo);

        if (!fromRate || !toRate) {
            alert('Один из указанных кодов валюты не найден.');
            return;
        }

        const conversionResult = (amountFrom * fromRate.Cur_OfficialRate) / toRate.Cur_OfficialRate;
        document.getElementById('conversionResult').textContent = `${conversionResult.toFixed(2)}`;
    } catch (error) {
        alert(`Ошибка при конвертации валюты: ${error.message}`);
    }
}