const selectMonedas = document.getElementById('select-monedas');
const inputMoneda = document.getElementById('input-moneda');
const conversion = document.getElementById('conversion')
const botonConvertir = document.getElementById('boton-convertir');
const grafico = document.getElementById('grafico');
const urlApi = 'https://mindicador.cl/api';

const appendMonedasSelect = async () => {
    try {
        const res = await fetch(urlApi);
        const data = await res.json();
        const monedas = Object.keys(data).filter(key => key !== 'version' && key !== 'autor' && key !== 'fecha');

        monedas.forEach(moneda => {
            const option = document.createElement('option');
            option.value = moneda;
            option.textContent = moneda;
            selectMonedas.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
};
appendMonedasSelect();

const formatoClp = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    return number.toString().replace(exp,rep);
  }

const convertirMoneda = async () => {
    const moneda = selectMonedas.value;
    try {
        const res = await fetch(urlApi + '/' + moneda);
        const data = await res.json();
        const valor = data?.serie[0]?.valor;
        const cantidad = inputMoneda.value;
        const total = cantidad * valor;
        const totalFormat = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total);
        conversion.textContent = 'Resultado: ' + totalFormat;
        renderGrafico(data.serie);
    } catch (error) {
        console.log(error);
    }
};

let chart;
const renderGrafico = (data) => {
    grafico.classList.add('active');
    const data10 = data.slice(0, 10);
    const label = data10.map(item => item.fecha.split('T')[0]).reverse()
    const valores = data10.map(item => item.valor).reverse()
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(grafico, {
        type: 'line',
        data: {
          labels: label,
          datasets: [{
            label: 'Valores últimos 10 días',
            data: valores,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
    })
}