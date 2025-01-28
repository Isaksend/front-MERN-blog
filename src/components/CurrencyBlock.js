import React, { useEffect, useState } from 'react';
function CurrencyRates() {
    const [rates, setRates] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/currency-rates')
            .then((response) => response.json())
            .then((data) => setRates(data))
            .catch((error) => console.error('Ошибка:', error));
    }, []);

    if (!rates) {
        return <div>Loading currencies...</div>;
    }

    return (
        <div>
            <h2>Currency today:</h2>
            <ul>
                <li>USD: {rates.USD} KZT</li>
                <li>EUR: {rates.EUR} KZT</li>
                <li>RUB: {rates.RUB} KZT</li>
            </ul>
        </div>
    );
}
export default CurrencyRates