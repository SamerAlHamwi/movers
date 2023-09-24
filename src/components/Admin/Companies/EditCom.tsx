import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, treeStyle, Text } from '../../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CompanyModal } from '@app/interfaces/interfaces';
import { Select, Option } from '../../common/selects/Select/Select';
import { UploadDragger } from '../../common/Upload/Upload';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { uploadAttachment } from '@app/services/Attachment';
import {
  BankOutlined,
  ClearOutlined,
  FileAddOutlined,
  InboxOutlined,
  LoadingOutlined,
  PictureOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { message, Alert, Button, Col, Input, Modal, Radio, Row, Steps, Upload, Tree, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getAllCity, getCities, getCountries, getRegions } from '@app/services/locations';
import { countries } from '../Locations/Countries';
import { useNavigate, useParams } from 'react-router-dom';
import { cities } from '../Locations/Cities';
import { getServices } from '@app/services/services';
import { services } from '../Services';
import { updateCompany, createCompany, getCompanyById } from '@app/services/company';
import { Card } from '@app/components/common/Card/Card';
import { TextArea } from '../Translations';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { RcFile, UploadFile } from 'antd/es/upload';
import type { DataNode } from 'antd/es/tree';
import { BaseFormItem } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';
import { Spinner } from '@app/components/common/Spinner/Spinner.styles';

const { Step } = Steps;
let requestServicesArray: any = [];
const requestServices: any = [];

const steps = [
  {
    title: 'Company Information',
  },
  {
    title: 'Userinformation',
  },
  {
    title: 'Services',
  },
  {
    title: 'Attachment',
  },
];
let companyInfo: any = {
  translations: [
    {
      name: 'string',
      bio: 'string',
      address: 'string',
      language: 'en',
    },
  ],
  services: [
    {
      serviceId: 0,
      subServiceId: 0,
      toolId: 0,
    },
  ],
  regionId: '0',
  companyContact: {
    dialCode: 's7',
    phoneNumber: 'string',
    emailAddress: 'string',
    webSite: 'string',
    isForBranchCompany: false,
  },
  comment: 'string',
  serviceType: 1,
  userDto: {
    dialCode: '963',
    phoneNumber: '0997829849',
    password: '865fghjk',
  },
  companyProfilePhotoId: 0,
  companyOwnerIdentityIds: [],
  companyCommercialRegisterIds: [],
  additionalAttachmentIds: [],
  availableCitiesIds: [],
};
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const EditCom: React.FC = () => {
  const { companyId } = useParams();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const [Data, setData] = useState<cities[] | undefined>();
  const [Dat, setDat] = useState<services[] | undefined>();
  const [countryData, setCountryData] = useState<countries[]>();
  const [Contry_id, setContryId] = useState(0);
  const [City_id, setCityId] = useState(0);
  const [Region_id, setRegionId] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [current, setCurrent] = useState(0);
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [valueRadio, setValueRadio] = useState(1);
  const [logo, setLogo] = useState();
  const [OwnerIdentityIds, setOwnerIdentityIds] = useState();
  const [CommercialRegisterIds, setCommercialRegisterIds] = useState();
  const [additionalAttachmentIds, setAdditionalAttachmentIds] = useState();
  const [formData, setFormData] = useState<CompanyModal>(companyInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLogoList, setImageLogoList] = useState([]);
  const [fileOwnerList, setFileOwnerList] = useState([]);
  const [imageOwnerList, setImageOwnerList] = useState([]);
  const [fileCommercialList, setFileCommercialList] = useState([]);
  const [imageCommercialList, setImageCommercialList] = useState([]);
  const [fileOtherList, setFileOtherList] = useState([]);
  const [imageOtherList, setImageOtherList] = useState([]);
  const [CityData, setCityData] = useState<cities[]>();
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const company = useQuery(['getCompany'], () =>
    getCompanyById(companyId)
      .then((data) => {
        const result = data.data?.result;
        setCompanyData(result);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );
  const [test, setTest] = useState<any[]>([]);
  const cities = useQuery(
    ['City'],
    () =>
      getAllCity()
        .then((data) => {
          const result = data.data?.result.items;
          setTotalCount(data.data?.result?.totalCount);
          setCityData(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: CityData === undefined,
    },
  );
  useEffect(() => {
    const updateFormValues = async () => {
      // Check if companyData is not an empty object
      const maher: any[] = [];
      companyData?.services?.map((item: any) => {
        item.subServices.map((subServices: any) => {
          subServices.tools.map((tools: any) => {
            maher.push(tools.id);
            return;
          });
        });
      });
      setTest(maher);
      console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;', maher);

      console.log('Updating form with new companyData:', companyData?.services);
      await form.setFieldsValue(companyData);
    };

    updateFormValues();
  }, [companyData, form]);

  const country = useQuery(
    ['Countries'],
    () =>
      getCountries()
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setCountryData(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: countryData === undefined,
    },
  );

  const ser = useQuery(
    ['Services'],
    () =>
      getServices()
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setDat(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: Dat === undefined,
    },
  );

  const GetAllServices = useQuery('getAllServices', getServices);

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    const serviceNode: DataNode = {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `${service?.id}`,
      children: [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
    if (service?.subServices?.length > 0) {
      serviceNode.children = service.subServices.map((subService: any) => {
        const subServiceNode = {
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={subService?.attachment?.url} width={16} height={16} />
              {subService?.name}
            </span>
          ),
          key: subService?.id,
          children: [],
        };
        if (subService?.tools?.length > 0) {
          subServiceNode.children = subService.tools.map((tool: any) => ({
            title: (
              <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                <Image src={tool?.attachment?.url} width={16} height={16} />
                {tool?.name}
              </span>
            ),
            key: tool?.id,
          }));
        }
        return subServiceNode;
      });
    }
    return serviceNode;
  });

  console.log('asdasdasdssssssssssssss', treeData);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const ChangeCountryHandler = (e: any) => {
    setContryId(e);
    form.setFieldValue('cityId', '');
    getCities(e)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data?.result?.totalCount);
        setData(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
    form.setFieldValue('regionId', '');

    getRegions(e)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data?.result?.totalCount);
        setData(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
  };

  const handleFormattedValueChange = (value: string) => {
    setFormattedPhoneNumber(value);
  };

  const extractDialCodeAndPhoneNumber = (fullPhoneNumber: string) => {
    const dialCode = fullPhoneNumber?.substring(0, fullPhoneNumber.indexOf('+') + 4);
    const phoneNumber = fullPhoneNumber?.substring(dialCode.length);
    return {
      dialCode,
      phoneNumber,
    };
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((response) => {
        response.data.success &&
          (setAttachmentId(response.data.result?.id), setUrlAfterUpload(response.data.result?.url));
        const photoId = response.data.result.id;
        const refType = response.data.result.refType;
        setFormData((prevFormData) => {
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
            setOwnerIdentityIds(photoId);
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
            setCommercialRegisterIds(photoId);
          } else if (refType === 11) {
            updatedFormData = {
              ...updatedFormData,
              additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
            };
            setAdditionalAttachmentIds(photoId);
          } else if (refType === 8) {
            updatedFormData = {
              ...updatedFormData,

              companyProfilePhotoId: photoId,
            };
            setLogo(photoId);
          }
          return updatedFormData;
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

  const UpdateCompany = useMutation((data: CompanyModal) =>
    updateCompany(data)
      .then((data: any) => {
        notificationController.success({ message: t('companies.editeCompanySuccessMessage') });
        queryClient.invalidateQueries('AllCompanies');
        navigate('/companies');
        requestServicesArray = [];
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        requestServicesArray = [];
      }),
  );

  const onFinish = (values: any) => {
    const { dialCode: dialCodeC, phoneNumber: phoneNumberC } = extractDialCodeAndPhoneNumber(
      form.getFieldValue(['companyContact', 'phoneNumber']),
    );
    const { dialCode: dialCodeU, phoneNumber: phoneNumberU } = extractDialCodeAndPhoneNumber(
      form.getFieldValue(['userDto', 'phoneNumber']),
    );
    function extractServicesIds(input: any) {
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          requestServices.push(result);
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          requestServices.push(result);
        }
        return result;
      });
    }
    extractServicesIds(requestServicesArray);
    const updatedFormData = { ...formData };
    console.log('zzaqsdxcfrfgvbhujm', updatedFormData.additionalAttachmentIds);

    companyInfo = {
      ...companyInfo,
      companyProfilePhotoId:
        companyData?.companyProfile?.id !== 0 && companyData?.companyProfile?.id !== null
          ? companyData?.companyProfile?.id
          : logo,
      companyOwnerIdentityIds:
        companyData?.companyOwnerIdentity[0]?.id !== 0 && companyData?.companyOwnerIdentity[0]?.id !== null
          ? [companyData?.companyOwnerIdentity[0]?.id]
          : updatedFormData.companyOwnerIdentityIds,
      companyCommercialRegisterIds:
        companyData?.companyCommercialRegister[0]?.id !== 0 && companyData?.companyCommercialRegister[0]?.id !== null
          ? [companyData?.companyCommercialRegister[0]?.id]
          : updatedFormData.companyCommercialRegisterIds,
      additionalAttachmentIds:
        companyData?.additionalAttachment[0]?.id !== 0 && companyData?.additionalAttachment[0]?.id !== null
          ? [companyData?.additionalAttachment[0]?.id]
          : updatedFormData.additionalAttachmentIds.filter((id: any) => id !== null && id !== 0),

      regionId: companyData?.region?.id !== 0 && companyData?.region?.id !== null ? companyData?.region?.id : Region_id,
      id: companyData?.id,
      translations: [
        {
          name: form.getFieldValue(['translations', 0, 'name']),
          bio: form.getFieldValue(['translations', 0, 'bio']),
          address: form.getFieldValue(['translations', 0, 'address']),
          language: 'ar',
        },
        {
          name: form.getFieldValue(['translations', 1, 'name']),
          bio: form.getFieldValue(['translations', 1, 'bio']),
          address: form.getFieldValue(['translations', 1, 'address']),
          language: 'en',
        },
      ],
      companyContact: {
        dialCode: form.getFieldValue(['', 1, 'address']),
        phoneNumber: phoneNumberC,
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: false,
      },
      availableCitiesIds: form.getFieldValue(['availableCitiesIds']),

      serviceType: valueRadio,
      services: requestServices,
      // // companyProfilePhotoId: logo,
      // // additionalAttachmentIds: updatedFormData.additionalAttachmentIds,
      // // companyOwnerIdentityIds: updatedFormData.companyOwnerIdentityIds,
      // // companyCommercialRegisterIds: updatedFormData.companyCommercialRegisterIds,
      // comment: form.getFieldValue('comment'),
      // regionId: Region_id,
    };
    updatedFormData.translations = companyInfo.translations;
    // updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);

    UpdateCompany.mutate(companyInfo);
  };

  const uploadImageButton = (
    <div style={{ color: '#40aaff' }}>
      <PictureOutlined />
      <div className="ant-upload-text">Upload Image</div>
    </div>
  );

  const uploadLogoButton = (
    <div style={{ color: '#40aaff' }}>
      <PictureOutlined />
      <div className="ant-upload-text">Upload Logo</div>
    </div>
  );

  const uploadFileButton = (
    <div style={{ color: 'rgb(14 190 21)' }}>
      <div>
        <FileAddOutlined />
      </div>
      <div className="ant-upload-text">Upload File</div>
    </div>
  );

  return (
    <Card title={t('companies.EditCompany')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'end'} style={{ width: '100%' }}>
        {current > 0 && (
          <Button
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => prev()}
          >
            {t('common.Previous')}
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => next()}
          >
            <CreateButtonText>{t('common.next')}</CreateButtonText>
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            htmlType="submit"
            disabled={UpdateCompany.isLoading || uploadImage.isLoading}
            onClick={() => onFinish(form.getFieldsValue())}
          >
            {t('common.done')}
          </Button>
        )}
      </Row>
      <Steps current={current} style={{ margin: '10px 10px 30px 0', padding: '0px 40px' }}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={t(`companies.${step.title}`)}
            icon={
              index === 0 ? (
                <BankOutlined />
              ) : index === 1 ? (
                <UserAddOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : index === 3 ? (
                <PictureOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <Spinner spinning={loading}>
        <BaseForm
          form={form}
          initialValues={companyData?.result}
          onFinish={onFinish}
          name="AddCompanyForm"
          style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
        >
          {current === 0 && (
            <>
              <Row style={{ display: 'flex', justifyContent: 'space-around', margin: '0 0 2rem' }}>
                <Col>
                  <Upload
                    maxCount={1}
                    key="image-logo"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    accept=".jpeg,.png,.jpg"
                    disabled={uploadImage.isLoading ? true : false}
                    fileList={imageLogoList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '8');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setImageLogoList(e.fileList)}
                  >
                    {imageLogoList.length >= 1 ? null : uploadLogoButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="Stored Photo" style={{ width: '50%', height: '50%' }} src={previewImage} />
                  </Modal>
                  {companyData?.companyProfile?.url && (
                    <img
                      alt="Stored Photo"
                      style={{ width: '30%', height: '30%' }}
                      src={companyData?.companyProfile?.url}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'name']}
                    label={<LableText>{t('companies.CompanyNamear')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'name']}
                    label={<LableText>{t('companies.name')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'bio']}
                    label={<LableText>{t('companies.Companybioar')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'bio']}
                    label={<LableText>{t('companies.bio')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'address']}
                    label={<LableText>{t('companies.addressA')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'address']}
                    label={<LableText>{t('companies.address')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>

              <BaseForm.Item
                name={['region', 'city', 'country', 'name']}
                label={<LableText>{t('companies.Country name')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeCountryHandler}>
                  {countryData?.map((country) => (
                    <Option key={country.id} value={country.id}>
                      {country?.name}
                    </Option>
                  ))}
                </Select>
              </BaseForm.Item>

              <BaseForm.Item
                name={['region', 'city', 'name']}
                label={<LableText>{t('companies.City name')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeCityHandler} value={City_id}>
                  {Data?.map((city: any) => (
                    <Select key={city.name} value={city.id}>
                      {city?.name}
                    </Select>
                  ))}
                </Select>
              </BaseForm.Item>

              <BaseForm.Item
                name={['region', 'name']}
                label={<LableText>{t('companies.Regionname')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeRegionHandler}>
                  {Data?.map((Region) => (
                    <Select key={Region?.name} value={Region?.id}>
                      {Region?.name}
                    </Select>
                  ))}
                </Select>
              </BaseForm.Item>
              <BaseForm.Item
                name={['availableCitiesIds']}
                label={<LableText>{t('companies.available City name')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              >
                <Select mode="multiple" value={City_id}>
                  {CityData?.map((city: any) => (
                    <Select key={city.name} value={city.id}>
                      {city?.name}
                    </Select>
                  ))}
                </Select>
              </BaseForm.Item>

              <h2
                style={{
                  color: 'black',
                  paddingTop: '7px',
                  paddingBottom: '15px',
                  fontSize: FONT_SIZE.xxl,
                  fontWeight: 'Bold',
                  margin: '3rem 5% 2rem',
                }}
              >
                {t('companies.Contact Information')}
              </h2>

              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    label={<LableText>{t('companies.CompanyEmail')}</LableText>}
                    name={['companyContact', 'emailAddress']}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input value={companyInfo?.companyContact?.emailAddress} />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    label={<LableText>{t('companies.website')}</LableText>}
                    name={['companyContact', 'webSite']}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input value={companyInfo?.companyContact?.webSite} />
                  </BaseForm.Item>
                </Col>
              </Row>
              <BaseButtonsForm.Item
                key={current}
                name={['companyContact', 'phoneNumber']}
                label={t('common.phoneNumber')}
                rules={[
                  { required: true, message: t('common.requiredField') },
                  () => ({
                    validator(_, value) {
                      if (!value || isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      }
                      if (formattedPhoneNumber.length > 12) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                      } else if (formattedPhoneNumber.length < 12) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                      }
                    },
                  }),
                ]}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}

                // style={{ margin: '2%', direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl' }}
              >
                <PhoneInput key={1} onChange={handleFormattedValueChange} country={'ae'} />
              </BaseButtonsForm.Item>
            </>
          )}
          {current === 1 && (
            <>
              <h2
                style={{
                  color: 'black',
                  paddingTop: '7px',
                  paddingBottom: '15px',
                  fontSize: FONT_SIZE.xxl,
                  fontWeight: 'Bold',
                  margin: '3rem 5% 2rem',
                }}
              >
                {t('companies.Userinformation')}
              </h2>
              <BaseButtonsForm.Item
                key={current}
                name={['user', 'userName']}
                $successText={t('auth.phoneNumberVerified')}
                label={t('common.phoneNumber')}
                rules={[
                  { required: true, message: t('common.requiredField') },
                  () => ({
                    validator(_, value) {
                      if (!value || isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      }
                      if (formattedPhoneNumber.length > 12) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                      } else if (formattedPhoneNumber.length < 12) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                      }
                    },
                  }),
                ]}
                style={
                  isDesktop || isTablet
                    ? {
                        width: '50%',
                        margin: 'auto',
                        direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl',
                      }
                    : {
                        width: '80%',
                        margin: '0 10%',
                        direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl',
                      }
                }
              >
                <PhoneInput key={2} onChange={handleFormattedValueChange} country={'ae'} />
              </BaseButtonsForm.Item>
            </>
          )}
          {current === 2 && (
            <>
              <BaseForm.Item key={10} name="serviceType">
                <Radio.Group
                  style={{ display: 'flex', width: '100%' }}
                  onChange={(event) => {
                    setValueRadio(event.target.value);
                  }}
                >
                  <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    Internal
                  </Radio>
                  <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    External
                  </Radio>
                  <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    Both
                  </Radio>
                </Radio.Group>
              </BaseForm.Item>
              <BaseForm.Item key="100" name={['services']}>
                {treeData?.map((serviceTreeData: any, serviceIndex: number) => {
                  const serviceKeys = selectedServicesKeysMap[serviceIndex] || [];
                  return (
                    <Tree
                      key={serviceIndex}
                      style={treeStyle}
                      checkable
                      defaultExpandAll={true}
                      onExpand={onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={(checkedKeysValue: any) => {
                        for (const key of checkedKeysValue) {
                          if (!requestServicesArray.includes(key)) {
                            requestServicesArray.push(key);
                          }
                        }
                        setSelectedServicesKeysMap((prevSelectedKeysMap) => {
                          const updatedKeysMap = { ...prevSelectedKeysMap };
                          updatedKeysMap[serviceIndex] = checkedKeysValue;
                          return updatedKeysMap;
                        });
                      }}
                      defaultCheckedKeys={serviceKeys}
                      // checkedKeys={test}
                      onSelect={onSelect}
                      selectedKeys={selectedKeys}
                      treeData={[serviceTreeData]}
                    />
                  );
                })}
              </BaseForm.Item>
            </>
          )}
          {current === 3 && (
            <>
              <Text
                style={{
                  color: '#01509A',
                  fontSize: FONT_SIZE.md,
                  marginBottom: '3rem',
                  paddingTop: '17px',
                  textAlign: 'center',
                }}
              >
                {t("companies. Uploadfiles (copy of the company's ID)")}
              </Text>

              <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Col>
                  <Upload
                    key="image-owner"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".jpeg,.png,.jpg"
                    listType="picture-card"
                    fileList={imageOwnerList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '9');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setImageOwnerList(e.fileList)}
                    maxCount={1}
                  >
                    {imageOwnerList.length >= 1 ? null : uploadImageButton}
                  </Upload>

                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                  {companyData?.companyOwnerIdentity[0]?.url && (
                    <img
                      alt="Stored Photo"
                      style={{ width: '30%', height: '30%' }}
                      src={companyData?.companyOwnerIdentity[0]?.url}
                    />
                  )}
                </Col>

                <Col>
                  <Upload
                    key="file-owner"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".Pdf"
                    listType="picture-card"
                    fileList={fileOwnerList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '9');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setFileOwnerList(e.fileList)}
                    maxCount={1}
                  >
                    {fileOwnerList.length >= 1 ? null : uploadFileButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
              </Row>

              <Text
                style={{
                  color: '#01509A',
                  fontSize: FONT_SIZE.md,
                  marginBottom: '3rem',
                  paddingTop: '16px',
                  textAlign: 'center',
                }}
              >
                {t('companies.Upload files (Commercial Register)')}
              </Text>
              <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Col>
                  <Upload
                    key="image-commercial "
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".jpeg,.png,.jpg"
                    listType="picture-card"
                    fileList={imageCommercialList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '10');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setImageCommercialList(e.fileList)}
                    maxCount={1}
                  >
                    {imageCommercialList.length >= 1 ? null : uploadImageButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                  {companyData?.companyCommercialRegister[0]?.url && (
                    <img
                      alt="Stored Photo"
                      style={{ width: '30%', height: '30%' }}
                      src={companyData?.companyCommercialRegister[0]?.url}
                    />
                  )}
                </Col>
                <Col>
                  <Upload
                    key="file-commercial "
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".Pdf"
                    listType="picture-card"
                    fileList={fileCommercialList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '10');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setFileCommercialList(e.fileList)}
                    maxCount={1}
                  >
                    {fileCommercialList.length >= 1 ? null : uploadFileButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
              </Row>

              <Text
                style={{
                  color: '#01509A',
                  fontSize: FONT_SIZE.md,
                  marginBottom: '3rem',
                  paddingTop: '16px',
                  textAlign: 'center',
                }}
              >
                {t('companies.Upload additional  files (3 maximum)')}
              </Text>
              <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Col>
                  <Upload
                    key="image-other"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".jpeg,.png,.jpg"
                    listType="picture-card"
                    fileList={imageOtherList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '11');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setImageOtherList(e.fileList)}
                    maxCount={3}
                  >
                    {imageOtherList.length >= 3 ? null : uploadImageButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                  {companyData?.additionalAttachment[0]?.url && (
                    <img
                      alt="Stored Photo"
                      style={{ width: '30%', height: '30%' }}
                      src={companyData?.additionalAttachment[0]?.url}
                    />
                  )}
                </Col>
                <Col>
                  <Upload
                    key="file-other"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".Pdf"
                    listType="picture-card"
                    fileList={fileOtherList}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('RefType', '11');
                      formData.append('file', file);
                      uploadImage.mutate(formData);
                      return false;
                    }}
                    onChange={(e: any) => setFileOtherList(e.fileList)}
                    maxCount={3}
                  >
                    {fileOtherList.length >= 3 ? null : uploadFileButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
              </Row>

              <BaseForm.Item key={88} name="comment">
                <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
              </BaseForm.Item>
            </>
          )}
        </BaseForm>
      </Spinner>
    </Card>
  );
};
