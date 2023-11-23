import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, treeStyle, Text } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CompanyModal } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { UploadDragger } from '../common/Upload/Upload';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { UploadMultiAttachment, uploadAttachment } from '@app/services/Attachment';
import {
  BankOutlined,
  ClearOutlined,
  FileAddOutlined,
  HomeOutlined,
  InboxOutlined,
  LoadingOutlined,
  PictureOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { message, Alert, Button, Col, Input, Modal, Radio, Row, Steps, Upload, Tree, Image, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getAllCity, getCities, getCountries, getRegions } from '@app/services/locations';
import { countries } from '../Admin/Locations/Countries';
import { useNavigate, useParams } from 'react-router-dom';
import { cities } from '../Admin/Locations/Cities';
import { getServices } from '@app/services/services';
import { Services } from '../Admin/Services';
import { getCompanyById, updateCompany } from '@app/services/companies';
import { Card } from '@app/components/common/Card/Card';
import { TextArea } from '../Admin/Translations';
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
let requestServices: any = [];

const steps = [
  {
    title: 'companyInfo',
  },
  {
    title: 'typeMove',
  },
  {
    title: 'services',
  },
  {
    title: 'attachments',
  },
];
let companyInfo: any = {
  translations: [
    {
      name: '',
      bio: '',
      address: '',
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
    phoneNumber: '',
    emailAddress: '',
    webSite: '',
    isForBranchCompany: false,
  },
  comment: '',
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

export const EditCompany: React.FC = () => {
  const { companyId } = useParams();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const Navigate = useNavigate();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const [current, setCurrent] = useState(0);
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [valueRadio, setValueRadio] = useState(0);
  const [logo, setLogo] = useState();
  const [OwnerImageIdentityId, setOwnerImageIdentityId] = useState();
  const [OwnerFileIdentityId, setOwnerFileIdentityId] = useState();
  const [CommercialImageRegisterId, setCommercialImageRegisterId] = useState();
  const [CommercialFileRegisterId, setCommercialFileRegisterId] = useState();
  const [additionalAttachmentIds, setAdditionalAttachmentIds] = useState();
  const [formData, setFormData] = useState<CompanyModal>(companyInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLogoList, setImageLogoList] = useState<any[]>([]);
  const [fileOwnerList, setFileOwnerList] = useState<any[]>([]);
  const [imageOwnerList, setImageOwnerList] = useState<any[]>([]);
  const [fileCommercialList, setFileCommercialList] = useState<any[]>([]);
  const [imageCommercialList, setImageCommercialList] = useState<any[]>([]);
  const [fileOtherList, setFileOtherList] = useState<any[]>([]);
  const [imageOtherList, setImageOtherList] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [testTest, setTestTest] = useState(true);
  const [countryIdForAvailableCities, setCountryIdForAvailableCities] = useState<string>('0');
  const [enableEdit, setEnableEdit] = useState(false);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>('0');
  const [regionId, setRegionId] = useState<string>('0');
  const [selectedCityValues, setSelectedCityValues] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [picturesList, setPicturesList] = useState<any[]>([]);

  const { data, status, refetch, isRefetching, isLoading } = useQuery(
    ['getCompanyById'],
    () =>
      getCompanyById(companyId)
        .then((data) => {
          const result = data.data?.result;
          setCompanyData(result);
          setTestTest(false);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    {
      enabled: testTest,
    },
  );

  const [test, setTest] = useState<any[]>([]);

  useEffect(() => {
    const updateFormValues = async () => {
      // Check if companyData is not an empty object

      // console.log('Updating form with new companyData:', companyData);

      const checkedKeysById: any[] = [];
      companyData?.services?.map((item: any) => {
        item.subServices?.map((sub: any) => {
          if (sub?.tools?.length === 0) {
            checkedKeysById.push(`${sub.id}`);
          } else
            sub.tools.map((tool: any) => {
              checkedKeysById.push(`${tool.id}`);
            });
        });
      });

      setTest(checkedKeysById);

      await form.setFieldsValue(companyData);
    };

    updateFormValues();
  }, [companyData, form]);

  useEffect(() => {
    if (companyData?.companyProfile) setImageLogoList([companyData?.companyProfile]);

    if (companyData?.companyOwnerIdentity) {
      const pdfAttachments: any[] = [];
      const imageAttachments: any[] = [];
      companyData.companyOwnerIdentity.forEach((item: any) => {
        if (item.url.endsWith('.pdf')) {
          pdfAttachments.push(item);
        } else {
          imageAttachments.push(item);
        }
        setFileOwnerList(pdfAttachments);
        setImageOwnerList(imageAttachments);
      });
    }

    if (companyData?.companyCommercialRegister) {
      const pdfAttachments: any[] = [];
      const imageAttachments: any[] = [];
      companyData.companyCommercialRegister.forEach((item: any) => {
        if (item.url.endsWith('.pdf')) {
          pdfAttachments.push(item);
        } else {
          imageAttachments.push(item);
        }
        setFileCommercialList(pdfAttachments);
        setImageCommercialList(imageAttachments);
      });
    }

    if (companyData?.additionalAttachment) {
      const pdfAttachments: any[] = [];
      const imageAttachments: any[] = [];
      companyData.additionalAttachment.forEach((item: any) => {
        if (item.url.endsWith('.pdf')) {
          pdfAttachments.push(item);
        } else {
          imageAttachments.push(item);
        }
      });
      setFileOtherList(pdfAttachments);
      setImageOtherList(imageAttachments);
    }
  }, [companyData]);

  const GetAllServices = useQuery('getAllServices', getServices);

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    return {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service${service?.id}`,
      serviceId: `${service?.id}`,
      children:
        service?.subServices?.length > 0
          ? service?.subServices?.map((subService: any) => {
              return {
                title: (
                  <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                    <Image src={service?.attachment?.url} width={16} height={16} />
                    <span style={{ fontWeight: 'bold' }}>{subService?.name}</span>
                  </span>
                ),
                key:
                  subService?.tools?.length > 0
                    ? `sub${subService?.id}`
                    : `onlySub service${service?.id} sub${subService?.id}`,
                serviceId: `${service?.id}`,
                subServiceId: `${subService?.id}`,
                children:
                  subService?.tools?.length > 0
                    ? subService?.tools?.map((tool: any) => {
                        return {
                          title: (
                            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                              <Image src={tool?.attachment?.url} width={16} height={16} />
                              <span style={{ fontWeight: 'bold' }}>{tool?.name}</span>
                            </span>
                          ),
                          key: `withTool service${service?.id} sub${subService?.id} tool${tool?.id}`,
                          serviceId: `${service?.id}`,
                          subServiceId: `${subService?.id}`,
                          toolId: `${tool?.id}`,
                        };
                      })
                    : [],
                disabled: service?.subServices?.length > 0 ? false : true,
              };
            })
          : [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
  });

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

  const GetAllCountries = useQuery('GetAllCountries', getCountries);
  const {
    data: availableCitiesData,
    refetch: availableCitiesRefetch,
    isFetching: isLoadingAvailableCities,
  } = useQuery('getCitiesForAvailabel', () => getCities(countryIdForAvailableCities), {
    enabled: countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined,
  });
  const { data: citiesData, refetch: citiesRefetch } = useQuery(
    'getCities',
    () => getCities(countryId != '0' ? countryId : companyData?.region?.city?.country?.id),
    {
      enabled: countryId != '0' || companyData?.region?.city?.country?.id != undefined,
    },
  );
  const { data: RegionsData, refetch: RegionsRefetch } = useQuery(
    'getRegions',
    () => getRegions(cityId != '0' ? cityId : companyData?.region?.city?.id),
    {
      enabled: cityId !== '0' || companyData?.region?.city?.id != undefined,
    },
  );

  useEffect(() => {
    if (countryId !== '0') {
      citiesRefetch();
      RegionsRefetch();
    }
  }, [countryId]);
  useEffect(() => {
    if (cityId !== '0') {
      RegionsRefetch();
    }
  }, [cityId]);
  useEffect(() => {
    if (countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined) {
      availableCitiesRefetch();
    }
  }, [countryIdForAvailableCities]);
  useEffect(() => {
    if (companyData?.availableCities) {
      setCountryIdForAvailableCities(companyData?.availableCities[0]?.countryId);
    }
  }, [companyData?.availableCities]);

  const ChangeCountryHandler = (e: any) => {
    setCountryId(e);
    form.setFieldValue('cityId', '');
    form.setFieldValue('regions', '');
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
    form.setFieldValue('regions', '');
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
        const type = response.data.result.url;
        const refType = response.data.result.refType;
        setFormData((prevFormData) => {
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
            if (response.data.result.url.endsWith('.pdf')) {
              setOwnerFileIdentityId(photoId);
            } else {
              setOwnerImageIdentityId(photoId);
            }
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
            if (response.data.result.url.endsWith('.pdf')) {
              setCommercialFileRegisterId(photoId);
            } else {
              setCommercialImageRegisterId(photoId);
            }
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
        Navigate('/companies');
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
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
      requestServices = [];
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        }
        return result;
      });
    }
    extractServicesIds(requestServices.length == 0 ? selectedServices : requestServicesArray);
    const updatedFormData = { ...formData };

    companyInfo = {
      ...companyInfo,
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
      companyProfilePhotoId: logo ? logo : imageLogoList[0].id,
      regionId: regionId != '0' ? regionId : companyData?.region?.id,
      companyContact: {
        dialCode: dialCodeC != '0' ? '+' + dialCodeC : companyData.companyContact.dialCode,
        phoneNumber: phoneNumberC != '0' ? phoneNumberC : companyData.companyContact.phoneNumber,
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: false,
      },
      id: companyData?.id,
      availableCitiesIds:
        selectedCityValues.length == 0 ? companyData?.availableCities.map((city: any) => city?.id) : selectedCityValues,
      serviceType: valueRadio == 0 ? companyData?.serviceType : valueRadio,
      services: requestServices,
      comment: form.getFieldValue('comment'),
      companyOwnerIdentityIds: [
        OwnerImageIdentityId,
        OwnerFileIdentityId,
        imageOwnerList[0]?.id,
        fileOwnerList[0]?.id,
      ].filter((value) => value !== undefined),
      companyCommercialRegisterIds: [
        CommercialImageRegisterId,
        CommercialFileRegisterId,
        imageCommercialList[0]?.id,
        fileCommercialList[0]?.id,
      ].filter((value) => value !== undefined),

      additionalAttachmentIds: imageOtherList.map((file) => file.id).concat(fileOtherList.map((file) => file.id)),
    };

    updatedFormData.translations = companyInfo.translations;
    console.log('companyInfo', companyInfo);
    setEnableEdit(true);

    if (companyInfo.companyOwnerIdentityIds == 0) {
      message.open({
        content: <Alert message={t('companies.atLeastOneOwnerAttachment')} type={`error`} showIcon />,
      });
      setEnableEdit(false);
      return;
    }
    if (companyInfo.companyCommercialRegisterIds == 0) {
      message.open({
        content: <Alert message={t('companies.atLeastOneCommercialAttachment')} type={`error`} showIcon />,
      });
      setEnableEdit(false);
      return;
    }
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

  useEffect(() => {
    const updateFormValues = async () => {
      const checkedKeysById: any[] = [];
      companyData?.services?.map((service: any) => {
        service.subServices?.map((subService: any) => {
          if (subService?.tools?.length === 0) {
            checkedKeysById.push(`onlySub service${service?.id} sub${subService?.id}`);
          } else
            subService.tools.map((tool: any) => {
              checkedKeysById.push(`withTool service${service?.id} sub${subService?.id} tool${tool?.id}`);
            });
        });
      });
      setSelectedServices(checkedKeysById);
      await form.setFieldsValue(companyData);
    };
    updateFormValues();
  }, [companyData, form]);

  useEffect(() => {
    if (enableEdit) {
      const showError = (messageText: string) => {
        message.open({
          content: <Alert message={messageText} type={`error`} showIcon />,
        });
      };
      if (requestServices.length === 0 && selectedServices.length === 0) {
        showError(t('requests.atLeastOneService'));
      } else {
        UpdateCompany.mutateAsync(companyInfo);
        setEnableEdit(false);
      }
    }
  }, [enableEdit]);

  const UploadAttachments = async (options: any) => {
    const { file } = options;

    if (typeof file?.uid === 'string') picturesList?.push(file);
    const formData = new FormData();
    picturesList?.forEach((item) => {
      formData.append('files', item);
    });
    formData.append('RefType', '11');
    const result = await UploadMultiAttachment(formData);
    const images: any[] = [];
    const files: any[] = [];

    result?.data?.result?.map((res: any) => {
      if (res.url.endsWith('.pdf')) {
        files.push({
          id: res?.id,
          status: 'done',
          url: res?.url,
        });
      } else {
        images.push({
          id: res?.id,
          status: 'done',
          url: res?.url,
        });
      }
    });
    setPicturesList([]);
    setImageOtherList(imageOtherList.concat(images));
    setFileOtherList(fileOtherList.concat(files));
  };

  const handlePreviews = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const uploadButtonForAllRequest = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
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
            {t('common.prev')}
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
                <HomeOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : index === 3 ? (
                <PictureOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <Spin spinning={isLoading}>
        {status === 'success' && companyData && (
          <BaseForm
            form={form}
            initialValues={companyData?.result}
            onFinish={onFinish}
            name="EditCompanyForm"
            style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
          >
            {current === 0 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('partners.generalInfo')}:</h4>

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
                      onChange={(e: any) => {
                        setImageLogoList(e.fileList);
                      }}
                    >
                      {imageLogoList.length >= 1 ? null : uploadLogoButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="Stored Photo" style={{ width: '50%', height: '50%' }} src={previewImage} />
                    </Modal>
                  </Col>
                </Row>

                <Row>
                  <Col
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', 0, 'name']}
                      label={<LableText>{t('common.name_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
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
                      label={<LableText>{t('common.name_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
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
                      label={<LableText>{t('common.bio_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
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
                      label={<LableText>{t('common.bio_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
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
                      label={<LableText>{t('common.address_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
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
                      label={<LableText>{t('common.address_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
                        },
                      ]}
                    >
                      <Input />
                    </BaseForm.Item>
                  </Col>
                </Row>

                <BaseForm.Item
                  label={<LableText>{t('companies.country')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select onChange={ChangeCountryHandler} defaultValue={companyData?.region?.city?.country?.name}>
                    {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                      <Option key={country.id} value={country.id}>
                        {country?.name}
                      </Option>
                    ))}
                  </Select>
                </BaseForm.Item>
                <BaseForm.Item
                  name="cityId"
                  label={<LableText>{t('companies.city')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select onChange={ChangeCityHandler} defaultValue={companyData?.region?.city?.name}>
                    {citiesData?.data?.result?.items.map((city: any) => (
                      <Option key={city.name} value={city.id}>
                        {city?.name}
                      </Option>
                    ))}
                  </Select>
                </BaseForm.Item>
                <BaseForm.Item
                  name={['regions']}
                  label={<LableText>{t('companies.region')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select onChange={ChangeRegionHandler} defaultValue={companyData?.region?.name}>
                    {RegionsData?.data?.result?.items.map((Region: any) => (
                      <Option key={Region?.name} value={Region.id}>
                        {Region?.name}
                      </Option>
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
                  {t('companies.companyContact')}
                </h2>

                <Row>
                  <Col
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      label={<LableText>{t('common.emailAddress')}</LableText>}
                      name={['companyContact', 'emailAddress']}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          type: 'email',
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
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
                      label={<LableText>{t('companies.webSite')}</LableText>}
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
                >
                  <PhoneInput key={1} onChange={handleFormattedValueChange} country={'ae'} />
                </BaseButtonsForm.Item>
              </>
            )}
            {current === 1 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.typeMove')}:</h4>

                <BaseForm.Item
                  name={['serviceType']}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Radio.Group
                    style={{ display: 'flex', width: '100%' }}
                    onChange={(event) => {
                      form.setFieldsValue({ ['serviceType']: event.target.value });
                      setValueRadio(event.target.value);
                    }}
                    defaultValue={companyData.serviceType}
                  >
                    <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                      {t('requests.Internal')}
                    </Radio>
                    <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                      {t('requests.External')}
                    </Radio>
                    <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                      {t('requests.both')}
                    </Radio>
                  </Radio.Group>
                </BaseForm.Item>

                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('companies.availableCities')}:</h4>

                <BaseForm.Item
                  name="availableCountries"
                  label={<LableText>{t('companies.country')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select
                    onChange={(e: any) => {
                      setCountryIdForAvailableCities(e);
                    }}
                    defaultValue={companyData?.availableCities.map((city: any) => city?.country.name)}
                  >
                    {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                      <Option key={country.id} value={country.id}>
                        {country?.name}
                      </Option>
                    ))}
                  </Select>
                </BaseForm.Item>

                <Spin spinning={isLoadingAvailableCities}>
                  <BaseForm.Item
                    label={<LableText>{t('companies.availableCities')}</LableText>}
                    style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    {!isLoadingAvailableCities && (
                      <Select
                        mode="multiple"
                        onChange={(cities: any) => setSelectedCityValues(cities)}
                        defaultValue={
                          countryIdForAvailableCities == companyData?.availableCities[0]?.countryId
                            ? companyData?.availableCities.map((city: any) => city?.id)
                            : []
                        }
                      >
                        {availableCitiesData?.data?.result?.items.map((city: any) => (
                          <Option key={city.id} value={city.id}>
                            {city.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </BaseForm.Item>
                </Spin>
              </>
            )}
            {current === 2 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('branch.selectService')} :</h4>
                <BaseForm.Item key="100" name={['services']}>
                  <Tree
                    style={treeStyle}
                    checkable
                    defaultExpandAll={true}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={(checkedKeysValue: any, info: any) => {
                      setSelectedServices(checkedKeysValue);
                      requestServicesArray = [...checkedKeysValue];
                    }}
                    defaultCheckedKeys={selectedServices}
                    checkedKeys={selectedServices}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                  />
                </BaseForm.Item>

                <BaseForm.Item key={88} name="comment">
                  <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
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
                  {t('companies.companyOwnerIdentity')}
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
                  {t('companies.companyCommercialRegister')}
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
                  {t('companies.additionalAttachment')}
                </Text>
                <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Col>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".jpeg,.png,.jpg"
                      listType="picture-card"
                      fileList={imageOtherList}
                      onPreview={handlePreviews}
                      maxCount={3}
                      onRemove={(file) => {
                        setImageOtherList((prev: any[]) => {
                          const test = prev.filter((item: any) => item?.uid !== file?.uid);

                          return test;
                        });
                        return;
                      }}
                      customRequest={UploadAttachments}
                    >
                      {imageOtherList.length >= 3 ? null : uploadButtonForAllRequest}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Col>

                  <Col>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".Pdf"
                      listType="picture-card"
                      fileList={fileOtherList}
                      onPreview={handlePreviews}
                      maxCount={3}
                      onRemove={(file) => {
                        setFileOtherList((prev: any[]) => {
                          const test = prev.filter((item: any) => item?.uid !== file?.uid);

                          return test;
                        });
                        return;
                      }}
                      customRequest={UploadAttachments}
                    >
                      {fileOtherList.length >= 3 ? null : uploadButtonForAllRequest}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Col>
                </Row>
              </>
            )}
          </BaseForm>
        )}
      </Spin>
    </Card>
  );
};
