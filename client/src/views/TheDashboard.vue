<template>
    <GrayContainer>
        <h1 class="headline font-weight-black mb-4 pa-0">Dashboard</h1>
        <v-divider></v-divider>
        <v-row justify="space-between" class="mt-3">
            <v-col cols="12" md="6">
                <v-card class="pa-7" width="100%">
                    <VueApexCharts
                        type="bar"
                        :options="destinationsChart.options"
                        :series="destinationsChart.series"
                    ></VueApexCharts>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="pa-7" width="100%">
                    <VueApexCharts
                        type="line"
                        :options="salesChart.options"
                        :series="salesChart.series"
                    ></VueApexCharts>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="space-between" class="mt-3">
            <v-col cols="12" md="7">
                <v-card class="pa-7" width="100%">
                    <VueApexCharts
                        type="area"
                        :options="mostRequestedRoutesChart.options"
                        :series="mostRequestedRoutesChart.series"
                    ></VueApexCharts>
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card class="pa-7" width="100%">
                    <VueApexCharts
                        type="pie"
                        :options="travelersChart.options"
                        :series="travelersChart.series"
                    ></VueApexCharts>
                </v-card>
            </v-col>
        </v-row>
    </GrayContainer>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import VueApexCharts from 'vue-apexcharts'
    const dateFormat = require('dateformat');

    export default {
        name: "TheDashboard",
        components: {GrayContainer, VueApexCharts},
        data() {
            return {
                last30Days: [],
                destinationsChart: {
                    options: {
                        chart: {
                            id: 'destinationsChart'
                        },
                        xaxis: {
                            categories: ['Bucuresti Nord', 'Brasov', 'Constanta', 'Cluj', 'Mures',
                                'Sibiu', 'Prahova', 'Suceava', 'Iasi', 'Galati'],
                        },
                        title: {
                            text: 'Most Visited Destinations (last 30 days)',
                            style: {
                                fontSize: '16px',
                            }
                        },
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: this.$vuetify.theme.themes.light.secondary,
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        }
                    },
                    series: [{
                        name: 'Sold Tickets',
                        data: [10855, 9672, 8659, 7902, 7371, 6825, 6461, 6174, 5968, 5714].map(s =>
                            (s * 0.6).toFixed(0))
                    }]
                },
                salesChart: {
                    options: {
                        chart: {
                            id: 'salesChart',
                            type: 'line'
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: []
                        },
                        title: {
                            text: 'Ticket Sales',
                            style: {
                                fontSize: '16px',
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shade: 'dark',
                                gradientToColors: [ this.$vuetify.theme.themes.light.secondary],
                                shadeIntensity: 1,
                                type: 'horizontal',
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100, 100, 100]
                            },
                        },
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: this.$vuetify.theme.themes.light.secondary,
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            }
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 4
                        },
                        yaxis: {
                            labels: {
                                formatter(val) {
                                    return val.toFixed(2) + ' USD'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Sales',
                        data: [56, 52, 48, 46, 49, 53, 55, 54, 59, 62, 58, 61, 64, 67, 60, 58, 57, 53, 49, 52, 59,
                            65, 69, 70, 67, 62, 63, 63, 64, 66, 68].map(s => (s * 13.17 * 34).toFixed(2))
                    }]
                },
                mostRequestedRoutesChart: {
                    series: [{
                        name: 'Bucuresti Nord (9:21) - Brasov (12:02)',
                        data: [56, 52, 48, 46, 49, 53, 55, 54, 59, 62, 58, 61, 64, 67, 60, 58, 57, 53, 49, 52, 59,
                            65, 69, 70, 67, 62, 63, 63, 64, 66, 69].map(s => (s * 3.3).toFixed(0))
                    }, {
                        name: 'Bucuresti Nord (10:27) - Constanta (12:14)',
                        data: [52, 50, 49, 41, 47, 50, 50, 45, 50, 58, 53, 56, 60, 61, 64, 67, 66, 60, 56, 53, 52,
                            54, 58, 64, 63, 60, 58, 56, 60, 63, 65].map(s => (s * 3.25).toFixed(0))
                    }, {
                        name: 'Constanta (19:30) - Bucuresti Nord (21:18)',
                        data: [53, 49, 45, 46, 49, 47, 44, 40, 38, 36, 39, 44, 48, 49, 51, 53, 57, 61, 59, 56, 53,
                            50, 47, 49, 51, 50, 47, 49, 52, 55, 57].map(s => (s * 3.25).toFixed(0))
                    }],
                    options: {
                        chart: {
                            id: 'mostRequestedRoutesChart',
                            type: 'area'
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: []
                        },
                        title: {
                            text: 'Most Requested Routes',
                            style: {
                                fontSize: '16px',
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth'
                        },
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: this.$vuetify.theme.themes.light.secondary,
                                shadeTo: 'light',
                                shadeIntensity: 0.95
                            }
                        },
                        yaxis: {
                            labels: {
                                formatter(val) {
                                    return val + ' tickets'
                                }
                            }
                        }
                    }
                },
                travelersChart: {
                    options: {
                        chart: {
                            id: 'travelersChart',
                            type: 'pie'
                        },
                        labels: ['Adult', 'Child', 'Retired'],
                        title: {
                            text: 'Number of Travelers (last 30 days)',
                            margin: 10,
                            style: {
                                fontSize: '16px'
                            }
                        },
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: this.$vuetify.theme.themes.light.secondary,
                                shadeTo: 'light',
                                shadeIntensity: 0.7
                            }
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    offset: -10
                                }
                            }
                        },
                        dataLabels: {
                            formatter(val, opts) {
                                const name = opts.w.globals.labels[opts.seriesIndex];
                                return [name, val.toFixed(2) + '%']
                            }
                        },
                        legend: {
                            show: false
                        }
                    },
                    series: [28547, 5472, 9690]
                }
            }
        },
        created() {
            let currentDay = new Date();

            for (let i = 0; i < 31; i++) {
                const day = dateFormat(currentDay, 'm/d/yyyy');
                this.last30Days.push(day);
                currentDay.setTime( currentDay.getTime() - 24 * 60 * 60 * 1000 );
            }

            this.last30Days.reverse();

            this.mostRequestedRoutesChart.options = {...this.mostRequestedRoutesChart.options, ...{
                    xaxis: {
                        type: 'datetime',
                        categories: this.last30Days
                    }
                }};

            this.salesChart.options = {...this.salesChart.options, ...{
                    xaxis: {
                        type: 'datetime',
                        categories: this.last30Days
                    }
                }}
        }
    }
</script>
