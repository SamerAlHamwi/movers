import React, { useState, useEffect } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetServiceStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';

const ServiceStatistics = () => {
  const { t } = useTranslation();

  const [serviceStatistics, setServiceStatistics] = useState<any[] | undefined>(undefined);

  const { data, refetch, isRefetching, error } = useQuery(['GetServiceStatistics'], () =>
    GetServiceStatistics()
      .then((response) => {
        if (response.data?.success) {
          setServiceStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = serviceStatistics?.map((serviceStatistic: any) => serviceStatistic.service.name);
  const yValues = serviceStatistics?.map((serviceStatistic: any) => ({
    x: serviceStatistic.service.name,
    y: serviceStatistic.requestForQuotationCount,
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
    colors: ['#F44F5E', '#E55A89', '#D863B1', '#CA6CD8'],
  };

  const series = [
    {
      name: 'Requests for Quotation Count',
      data: yValues || [],
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.ServiceStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default ServiceStatistics;
