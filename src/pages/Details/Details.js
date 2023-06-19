import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import months from '../../helpers/months'
import api from '../../api'
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Datalabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  Legend,
  Datalabels,
);

const options = {
  responsive: true,
  layout: {
    padding: 40,
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    datalabels: {
        color: (context) => ['green', 'orange'][context.dataIndex],
        display: (context) => {
          return context.dataset.data[context.dataIndex];
        },
        padding: 6,
        font: {
          size: '20px',
        },
        formatter: Math.round,
        anchor: 'end',
        align: 'end',
      }
  },
};

const factories = { '1': 'A', '2': 'Б' }

function Details() {
  const { factoryId, monthId } = useParams()
  const [data, setData] = useState([])

  useEffect(() => {
    api.get('/products')
      .then(((rawData) => {
        const res = rawData.filter((item) => {
          if (String(item.factory_id) !== factoryId) return false
          if ((item.date || '').split('/')[1] !== monthId) return false
          return true
        })
        .reduce((acc, item) => {
          return [
            acc[0] + (item.product1 / 1000),
            acc[1] + (item.product2 / 1000),
          ]
        }, [0, 0])
        setData(res)
      }))
  }, [factoryId, monthId])

  return (
    <main className="main">
      <h1>
        {`Статистика по продукции фабрики ${factories[factoryId]} за ${months[monthId]}`}
      </h1>
      <Pie
        data={{
          labels: ['Продукт 1', 'Продукт 2'],
          datasets: [{
            labels: data,
            data,
            backgroundColor: ['green', 'orange'],
            borderColor: ['green', 'orange'],
          }],
        }}
        options={options}
      />
    </main>
  )
}

export default Details
