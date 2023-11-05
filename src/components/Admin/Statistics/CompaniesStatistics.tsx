import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetCompaniesStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';

const CompaniesStatistics = () => {
  const { t } = useTranslation();

  const [companiesStatistics, setServiceStatistics] = useState<any[] | undefined>(undefined);

  const { data, refetch, isRefetching, error } = useQuery(['GetCompaniesStatistics'], () =>
    GetCompaniesStatistics()
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

  const xValues = companiesStatistics?.map((companyStatistics: any) => companyStatistics.company.name);
  const yValues = companiesStatistics?.map((companyStatistics: any) => ({
    x: companyStatistics.company.name,
    y: companyStatistics.requestForQuotationCount,
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
  };

  const series = [
    {
      name: `${t('charts.requestsCount')}`,
      data: yValues || [],
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.CompaniesStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default CompaniesStatistics;
