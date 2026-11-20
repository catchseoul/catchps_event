export type EventId = 'first-nose' | 'revision-nose' | 'forehead-lift';

export interface CatchEventData {
  id: EventId;
  code: string;
  shortLabel: string;
  priceLabel: string;
  thumbnailUrl: string;
  detailImages: string[];
  defaultSurgeryArea: string;
  formSubtitle: string;
}

export const GOOGLE_SCRIPT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxqYezEQoz0NMwotVOZ-lZrawmjujy_L_Zll_BVLWiungJm6T9_2XAv7aHTk95qNM3qeg/exec';

export const SURGERY_AREA_OPTIONS = [
  { value: '코성형', label: '코성형' },
  { value: '코재수술', label: '코재수술' },
  { value: '이마거상', label: '이마거상' },
  { value: '눈성형', label: '눈성형' },
  { value: '기타문의', label: '기타문의' },
] as const;

export const CATCH_EVENTS: CatchEventData[] = [
  {
    id: 'first-nose',
    code: '01',
    shortLabel: '첫코성형',
    priceLabel: '265만원~',
    thumbnailUrl: '/assets/catch/thumb_1_first_nose.jpg',
    detailImages: ['/assets/catch/detail_1_first_nose.jpg'],
    defaultSurgeryArea: '코성형',
    formSubtitle: '추가금 없는 첫코성형 이벤트 상담 및 예약',
  },
  {
    id: 'revision-nose',
    code: '02',
    shortLabel: '코재수술',
    priceLabel: '550만원',
    thumbnailUrl: '/assets/catch/thumb_2_revision_nose.jpg',
    detailImages: ['/assets/catch/detail_2_revision_nose.jpg'],
    defaultSurgeryArea: '코재수술',
    formSubtitle: '추가금 없는 코재수술 550만원 이벤트 상담 및 예약',
  },
  {
    id: 'forehead-lift',
    code: '03',
    shortLabel: '내시경이마거상',
    priceLabel: '149만원',
    thumbnailUrl: '/assets/catch/thumb_3_forehead.jpg',
    detailImages: ['/assets/catch/detail_3_forehead.jpg'],
    defaultSurgeryArea: '이마거상',
    formSubtitle: '추미근절제술 포함 149만원 이벤트 상담 및 예약',
  },
];

export const CLINIC_INFO = {
  logoUrl: '/assets/aistudio/image_06c91f42.png',
  director: '박정열',
  businessNumber: '675-04-03925',
  phone: '02-543-9995',
  fax: '02-542-9995',
  address: '서울시 강남구 강남대로 478 제우빌딩 5층',
  subway: '신논현역 3번 출구 도보 약 1분 (9호선 · 신분당선)',
  hoursWeekday: '월~금 10:00 ~ 19:00',
  hoursSaturday: '토요일 10:00 ~ 17:00',
  hoursClosed: '일요일 · 공휴일 휴진',
};
