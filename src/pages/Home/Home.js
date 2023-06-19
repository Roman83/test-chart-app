import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import months from '../../helpers/months'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
} from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import api from '../../api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        drawTicks: true,
        borderColor: "transparent",
        color: "transparent",
        tickColor: '#eee',
      },
      border: {
        color: '#eee',
      },
    },
    y: {
      grid: {
        display: true,
        drawTicks: true,
        borderColor: "transparent",
        color: "transparent",
        tickColor: '#eee',
      },
      border: {
        color: '#eee',
      },
    },
  },
};

const MONTHS = months.map(item => item.substr(0, 2))

const filterOptions = [
  { value: 'all', label: 'Все продукты' },
  { value: '1', label: 'Продукт 1' },
  { value: '2', label: 'Продукт 2' },
]

function Home() {
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState({
    months: [],
    labels: [],
    factory1: [],
    factory2: [],
  })
  const [filter, setFilter] = useState(localStorage.getItem('chart-app-home-filter') || 'all')

  const chartRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products')
      .then(((res) => setData(res)))
  }, [])

  useEffect(() => {
    if (data) {
      const resObj = data.reduce((acc, item) => {
        if (item.date) {
          const dateArr = item.date.split('/')
          const dateStr = `${dateArr[2]}-${(dateArr[1] < 10) ? '0' : ''}${dateArr[1]}`
          const accData = acc[dateStr] || {}
          const value = (filter === 'all')
            ? (item.product1 + item.product2 + item.product3)
            : (item[`product${filter}`])
          acc[dateStr] = {
            ...accData,
            date: dateStr,
            [`factory${item.factory_id}`]: value + (accData[`factory${item.factory_id}`] || 0),
          }
        }

        return acc
      }, {})
      const res = Object.values(resObj).sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      }).reduce((acc, item) => ({
        months: [...acc.months, String(+item.date.split('-')[1])],
        labels: [...acc.labels, MONTHS[item.date.split('-')[1] - 1]],
        factory1: [...acc.factory1, item.factory1 / 1000],
        factory2: [...acc.factory1, item.factory2 / 1000],
      }), { months: [], labels: [], factory1: [], factory2: [] })

      setFilteredData(res)
    }
  }, [filter, data])

  const onChangeFilter = (e) => {
    setFilter(e.target.value)
    localStorage.setItem('chart-app-home-filter', e.target.value)
  }

  return (
    <main className="main">
      <h1 className="panel panel-right">
        Фильтр по типу продукции
        <select name="" id="" onChange={onChangeFilter}>
          {filterOptions.map((item) => (
            <option
              key={item.value}
              value={item.value}
              selected={item.value === filter}
            >
              {item.label}
            </option>
          ))}
        </select>
      </h1>
      <div className="panel">
        <Bar
          ref={chartRef}
          options={options}
          data={{
            labels: filteredData.labels,
            datasets: [
              {
                label: 'Фабрика А',
                data: filteredData.factory1 || [],
                backgroundColor: 'red',
              },
              {
                label: 'Фабрика Б',
                data: filteredData.factory2 || [],
                backgroundColor: 'blue',
              },
            ],
          }}
          onClick={(e) => {
            const data = getElementAtEvent(chartRef.current, e)[0]
            if (!data) return

            const factoryId = data.datasetIndex + 1;
            const monthId = filteredData.months[data.index];
            navigate(`/details/${factoryId}/${monthId}`)
          }}
        />
      </div>
    </main>
  )
}

export default Home
