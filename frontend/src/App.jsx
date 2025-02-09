import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { currencies } from "./currencies";

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(savedHistory);
  }, []);

  const saveHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const convertCurrencies = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`
      );

      let result = Object.values(data.data)[0] * amount;
      let roundofResult = result.toFixed(2);
      const countryCode = currencies.find(
        (currency) => currency.code === selectedCurrency
      );

      saveHistory({
        result: roundofResult,
        flag: countryCode.flag,
        symbol: countryCode.symbol,
        code: countryCode.code,
        countryName: countryCode.name,
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      alert("Error fetching conversion rates.");
    }
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = conversionHistory.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-5 md:px-20">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[660px] h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Smart Currency Converter
        </h1>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Base Currency:</label>
          <select
            className="w-full border-gray-400 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Amount:</label>
          <input
            type="number"
            className="w-full border-gray-400 rounded-lg p-2 my-1 bg-gray-200 font-semibold text-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-gray-800 text-white p-3 rounded-lg font-semibold text-xl w-52 transition-all duration-300 hover:bg-gray-700"
            onClick={convertCurrencies}
          >
            Convert
          </button>
        </div>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Currencies to Convert:</label>
          <select
            className="w-full border-gray-400 rounded-lg p-2 my-1 bg-gray-200 font-semibold text-xl"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="">Search Currency</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 px-1">
          <h2 className="text-2xl px-1 font-bold text-gray-900 mb-4">
            Conversion History
          </h2>
        </div>
        <div className="px-1 h-[400px]">
          <ul className="px-1">
            {conversionHistory.length > 0 ? (
              conversionHistory.map((entry, index) => (
                <li
                  key={index}
                  className="text-gray-700 mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={`https://flagcdn.com/w40/${entry.flag}.png`}
                      alt="Country Flag"
                      className="w-11 h-11"
                    />
                    <p className="flex flex-col gap-1 text-gray-500 font-medium">
                      <span className="text-xl font-semibold text-black">
                        {entry.symbol} {entry.result}
                      </span>
                      <span>
                        {entry.code} - {entry.countryName}
                      </span>
                    </p>
                  </div>
                  <span
                    className="text-gray-500 font-bold text-xl hover:cursor-pointer"
                    onClick={() => deleteHistoryItem(index)}
                  >
                    x
                  </span>
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-500 font-semibold">
                Conversion history is empty.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
