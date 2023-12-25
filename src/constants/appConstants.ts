import { CompanyStatus } from './enums/companyStatues';
import { DayOfWeek } from './enums/dayOfWeek';
import { RequestType } from './enums/requestTypes';

export const AR = 'ar';
export const EN = 'en';

export const PHONE_NUMBER_LENGTH = 9;
export const PHONE_NUMBER_CODE = '+971';

export const DAYS_OF_WEEK_NAME = [
  { day: DayOfWeek?.Sunday, dayName: 'Sunday' },
  { day: DayOfWeek?.Monday, dayName: 'Monday' },
  { day: DayOfWeek?.Tuesday, dayName: 'Tuesday' },
  { day: DayOfWeek?.Wednesday, dayName: 'Wednesday' },
  { day: DayOfWeek?.Thursday, dayName: 'Thursday' },
  { day: DayOfWeek?.Friday, dayName: 'Friday' },
  { day: DayOfWeek?.Saturday, dayName: 'Saturday' },
];

export const TIME_HOURS_MINUTES = 'HH:mm:ss';

export const REQUEST_TYPES = [
  { type: RequestType.Checking, name: 'checking' },
  { type: RequestType.Approved, name: 'approved' },
  { type: RequestType.Rejected, name: 'rejected' },
  { type: RequestType.Possible, name: 'possible' },
  { type: RequestType.HasOffers, name: 'hasOffers' },
  { type: RequestType.InProcess, name: 'inProcess' },
  { type: RequestType.FinishByCompany, name: 'FinishByCompany' },
  { type: RequestType.FinishByUser, name: 'FinishByUser' },
  { type: RequestType.NotFinishByUser, name: 'NotFinishByUser' },
  { type: RequestType.Finished, name: 'Finished' },
  { type: RequestType.Canceled, name: 'canceled' },
  { type: RequestType.CanceledAfterRejectOffers, name: 'CanceledAfterRejectOffers' },
  { type: RequestType.OutOfPossible, name: 'OutOfPossible' },
];

export const COMPANY_STATUS_NAMES = [
  { value: CompanyStatus.Checking, name: 'checking' },
  { value: CompanyStatus.Approved, name: 'approved' },
  { value: CompanyStatus.Rejected, name: 'rejected' },
  { value: CompanyStatus.RejectedNeedToEdit, name: 'rejectedNeedToEdit' },
];
