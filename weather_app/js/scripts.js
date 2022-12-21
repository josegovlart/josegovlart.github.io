
$(function () {


    // *** APIs ***
    // clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
    const ACCUWEATHER_API_KEY = 'b8W2PeVVc8DahhgbHcO4mjlwuutPkdeG';

    // pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
    const MAPBOX_API_KEY = 'pk.eyJ1IjoiamdvdWxhcnQyMDAwIiwiYSI6ImNrczBiajlxdDBiazQybm16ZGN1dTg3eDQifQ.6L5PYnU7P56PWDxMZuD2aQ';

    // pegar coordenadas do IP: http://www.geoplugin.net

    // gerar gráficos em JS: https://www.highcharts.com/demo

    // http://dataservice.accuweather.com/currentconditions/v1/127164?apikey=b8W2PeVVc8DahhgbHcO4mjlwuutPkdeG&language=pt-br
    let weatherObj = {
        city: '',
        state: '',
        country: '',
        temperature: '',
        weather: '',
        icon: ''
    };

    let fillWeather = (city, state, country, weather, temperature, icon) => {
        let weatherLocalText = `${city}, ${state}. ${country}`;
        $('#texto_local').text(weatherLocalText);
        $('#texto_clima').text(weather);
        $('#texto_temperatura').html(String(temperature) + '&deg;');
        $('#icone_clima').css('background-image', `url('${weatherObj.icon}')`);
    };

    let getCurrentWeather = (localCode) => {
        $.ajax({
            url: `http://dataservice.accuweather.com/currentconditions/v1/${localCode}?apikey=${ACCUWEATHER_API_KEY}&language=pt-br`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("current conditions: ", data);

                weatherObj.temperature = data[0].Temperature.Metric.Value;
                weatherObj.weather = data[0].WeatherText;

                let iconNumber = data[0].WeatherIcon <= 9 ? '0' + String(data[0].WeatherIcon) : String(data[0].WeatherIcon);
                weatherObj.icon = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;

                fillWeather(weatherObj.city, weatherObj.state, weatherObj.country, weatherObj.weather, weatherObj.temperature, weatherObj.icon);
            },
            error: () => {
                console.log('Erro');
                getErrors('Erro ao obter clima atual!');
            }
        });
    };

    let fill5DaysForecast = (forecasts) => {
        $('#info_5dias').empty();
        let weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        forecasts.forEach(value => {
            let weekDay = new Date(value.Date).getDay();
            weekDay = weekDays[weekDay];
            let temp_min = value.Temperature.Minimum.Value;
            let temp_max = value.Temperature.Maximum.Value;
            let icon = value.Day.Icon <= 9 ? '0' + String(value.Day.Icon) : String(value.Day.Icon);
            $('#info_5dias').append(`
            <div class="day col">
                <div class="day_inner">
                    <div class="dayname">
                        ${weekDay}
                    </div>
                    <div style="background-image: url('https://developer.accuweather.com/sites/default/files/${icon}-s.png')"
                    class="daily_weather_icon"></div>
                    <div class="max_min_temp">
                        ${temp_min}&deg; / ${temp_max}&deg;
                    </div>
                </div>
            </div>
            `);
        });
    };

    let get5DaysWeatherForecast = (localCode) => {
        $.ajax({
            url: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${localCode}?apikey=${ACCUWEATHER_API_KEY}&language=pt-br&metric=true`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("5 days forecast: ", data);
                fill5DaysForecast(data.DailyForecasts);
                $('#texto_max_min').html(`${String(data.DailyForecasts[0].Temperature.Minimum.Value)}&deg; / ${String(data.DailyForecasts[0].Temperature.Maximum.Value)}&deg;`);
            },
            error: () => {
                console.log('Erro');
                getErrors('Erro ao obter previsão de 5 dias!');
            }
        });
    };

    let getGraph = (hours, city, arrayData) => {
        Highcharts.chart('hourly_chart', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: hours
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                labels: {
                    formatter: function () {
                        return this.value + '°';
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                name: city,
                marker: {
                    symbol: 'square'
                },
                data: arrayData

            }]
        });
    };

    let getHourlyWeatherForecast = (localCode) => {
        $.ajax({
            url: `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${localCode}?apikey=${ACCUWEATHER_API_KEY}&language=pt-br&metric=true`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("hourly forecast: ", data);
                let hours = [];
                let arrayData = [];
                data.forEach(element => {
                    let hour = new Date(element.DateTime).getHours();
                    let icon = element.WeatherIcon <= 9 ? '0' + String(element.WeatherIcon) : String(element.WeatherIcon);
                    hours.push(hour + 'h');
                    arrayData.push({
                        y: element.Temperature.Value,
                        marker: {
                            symbol: `url(https://developer.accuweather.com/sites/default/files/${icon}-s.png)`
                        }
                    });
                });
                getGraph(hours, weatherObj.city, arrayData);
                $('.refresh-loader').fadeOut();
            },
            error: () => {
                console.log('Erro');
                getErrors('Erro ao obter previsão hora a hora!');
            }
        });
    };

    let getLocalCode = (lat, long) => {
        $.ajax({
            url: `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${lat}%2C${long}&language=pt-br`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("geoposition: ", data);

                try {
                    weatherObj.city = data.ParentCity.LocalizedName;
                } catch (error) {
                    weatherObj.city = data.LocalizedName;
                }
                weatherObj.state = data.AdministrativeArea.LocalizedName;
                weatherObj.country = data.Country.LocalizedName;

                let Key = data.Key;
                getCurrentWeather(Key);
                get5DaysWeatherForecast(Key);
                getHourlyWeatherForecast(Key);
            },
            error: () => {
                console.log('Erro');
                getErrors('Erro no código do local!');
            }
        });
    };

    let getIpCoordinates = () => {
        $.ajax({
            url: 'http://www.geoplugin.net/json.gp',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                if (data.geoplugin_latitude && data.geoplugin_longitude) {
                    getLocalCode(data.geoplugin_latitude, data.geoplugin_longitude);
                } else {
                    getLocalCode(-30.003490914460244, -50.13064025039447);
                }
            },
            error: () => {
                console.log('Erro');
            }
        });
    };

    let getSearchCoordinates = (input) => {
        input = encodeURI(input);
        $.ajax({
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${MAPBOX_API_KEY}`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("mapbox: ", data);
                getLocalCode(data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]);
            },
            error: () => {
                console.log('Erro no mapbox');
                getErrors('Erro na pesquisa do local!');
            }
        });
    };

    let getErrors = (message) => {
        if (!message) {
            message = 'Erro na solicitação!';
        }

        $('.refresh-loader').hide();
        $('#error-warning').text(message);
        $('#error-warning').slideDown();
        $("html").animate(
            {
                scrollTop: $("#error-warning").offset({ top: 20 })
            },
            80 //speed
        );
        window.setTimeout(() => {
            $('#error-warning').slideUp();
        }, 4000);
    };

    getGraph();

    getIpCoordinates();

    $('#search-button').click(() => {
        $('.refresh-loader').show();
        let place = $('input#local').val();
        if (place) {
            getSearchCoordinates(place);
        } else {
            alert('Local inválido');
        }
    });

    $('input#local').on('keypress', (e) => {
        if (e.which == 13) {
            $('.refresh-loader').show();
            let place = $('input#local').val();
            if (place) {
                getSearchCoordinates(place);
            } else {
                alert('Local inválido');
            }
        }
    });
});


