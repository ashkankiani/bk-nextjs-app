import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import dynamic from 'next/dynamic'
import { numberWithCommas } from '@/libs/convertor'
import React from 'react'
import useHook from '@/hooks/controller/useHook'

if (typeof Highcharts === 'object') {
  // HighchartsExporting(Highcharts)
  // require('highcharts/modules/exporting')(Highcharts)
  // require('highcharts/modules/export-data')(Highcharts)
}

const TheSpinner = dynamic(() => import('@/components/layout/TheSpinner'), {
  loading: () => 'بارگذاری',
})

type TypeChartAreaSplineProps<T> = {
  loading: boolean
  data: T[] | undefined
  series: T[]
  category: T[]
  reference: React.Ref<any>
}

export default function ChartAreaSpline<T>({
  loading,
  data,
  series,
  category,
  reference,
}: TypeChartAreaSplineProps<T>) {
  const { theme } = useHook()

  if (loading) {
    return (
      <div className="flex-center-center h-[400px] w-full">
        <TheSpinner />
      </div>
    )
  } else {
    const options = {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        marginTop: 20,
        marginBottom: 60,
        marginLeft: 65,
        marginRight: 20,
        height: 480,
        spacing: [0, 0, 0, 0],
        style: {
          fontFamily: 'font-yekanBakh',
          fontSize: '15px',
        },
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      title: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: '',
        },
        categories: category,
        crosshair: {
          className: theme === 'light' ? 'stroke-[#a8edf9]' : 'stroke-[#185872]',
          dashStyle: 'LongDash',
          width: 1,
        },
        labels: {
          formatter: function () {
            return (
              '<span class="stroke-[#185872] dark:stroke-[#fff] font-light">' +
              this.value +
              '</span>'
            )
          },
          style: {
            fontSize: '13px',
          },
        },
      },
      yAxis: [
        {
          title: {
            text: 'درآمد',
            style: {
              color: '#0ca8ce',
            },
          },
          crosshair: {
            className: theme === 'light' ? 'stroke-[#a8edf9]' : 'stroke-[#185872]',
            dashStyle: 'LongDash',
            width: 1,
          },
          gridLineColor: theme === 'light' ? '#a8edf9' : '#185872',
          gridLineWidth: 1,
          gridLineDashStyle: 'LongDash',
          labels: {
            formatter: function () {
              return (
                '<span class="stroke-[#185872] dark:stroke-[#fff] font-light">' +
                this.value +
                '</span>'
              )
            },
            style: {
              fontSize: '13px',
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: '#def4ff',
        borderColor: '#b6ecff',
        borderRadius: 5,
        shadow: false,
        padding: 10,
        style: {
          fontSize: '15px',
        },
        formatter: function () {
          let time = this.x
          let yName1 = this.points[0].series.name
          let yVal1 = this.points[0].y
          return (
            '<div class="font-bold">' +
            '<div class="fill-hblue-500">' +
            yName1 +
            ': ' +
            numberWithCommas(yVal1) +
            ' تومان' +
            '</div><br><br>' +
            '<div class="fill-hdove-800">تاریخ: ' +
            time +
            '</div>' +
            '</div>'
          )
        },
      },
      plotOptions: {
        series: {
          pointPlacement: series.length !== 1 ? 'on' : undefined,
          marker: {
            enabled: false,
          },
          fillColor: {
            linearGradient: [0, 100, 0, 320],
            stops: [
              [0, Highcharts.color('#0ca8ce').setOpacity(0.4).get('rgba')],
              [1, Highcharts.color('#0ca8ce').setOpacity(0.05).get('rgba')],
            ],
          },
        },
      },
      series: series,
      exporting: {
        enabled: false,
      },
    }
    return data && data.length !== 0 ? (
      <HighchartsReact highcharts={Highcharts} options={options} ref={reference} />
    ) : (
      <div className="flex-center-center fa-regular-18px h-[376px] w-full">داده ای وجود ندارد.</div>
    )
  }
}
