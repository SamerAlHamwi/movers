import React, { useState, useEffect } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetCitiesStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';

const CitiesStatistics = () => {
  const { t } = useTranslation();

  const [citiesStatistics, setCitiesStatistics] = useState<any[] | undefined>(undefined);

  const { data, refetch, isRefetching, error } = useQuery(['GetCitiesStatistics'], () =>
    GetCitiesStatistics()
      .then((response) => {
        if (response.data?.success) {
          setCitiesStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = citiesStatistics?.map((cityStatistics: any) => cityStatistics.cityDto.name);
  const yValues = citiesStatistics?.map((cityStatistics: any) => ({
    x: cityStatistics.cityDto.name,
    y: cityStatistics.requestForQuotationCount,
  }));

  const options: any = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: xValues || [],
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
      },
    },
    colors: ['#2196F3', '#1976D2', '#1565C0', '#0D47A1'],
  };

  const series = [
    {
      name: `${t('charts.requestsCount')}`,
      data: yValues || [],
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.CitiesStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default CitiesStatistics;
