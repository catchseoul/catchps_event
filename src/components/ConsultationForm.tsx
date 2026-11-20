import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Lock, RotateCcw } from 'lucide-react';
import {
  CatchEventData,
  GOOGLE_SCRIPT_ENDPOINT,
  SURGERY_AREA_OPTIONS,
} from '../data/events';

interface ConsultationFormProps {
  event: CatchEventData;
}

function formatKoreanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function ConsultationForm({ event }: ConsultationFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [surgeryArea, setSurgeryArea] = useState(event.defaultSurgeryArea);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [showPrivacyText, setShowPrivacyText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submittedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const iframeName = `hidden_iframe_${event.id}`;

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const completeSubmission = () => {
    if (!submittedRef.current) return;
    submittedRef.current = false;
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage(null);

    const trimmedName = name.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      e.preventDefault();
      setErrorMessage('이름을 2자 이상 입력해주세요.');
      return;
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      e.preventDefault();
      setErrorMessage('올바른 전화번호를 입력해주세요. (예: 010-0000-0000)');
      return;
    }

    if (!surgeryArea) {
      e.preventDefault();
      setErrorMessage('원하는 수술 부위를 선택해주세요.');
      return;
    }

    if (!privacyAgreed) {
      e.preventDefault();
      setErrorMessage('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    // Native POST continues into the hidden iframe targeting the exact Catch PS Google Apps Script endpoint
    submittedRef.current = true;
    setIsSubmitting(true);

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
    }
    fallbackTimerRef.current = window.setTimeout(() => {
      completeSubmission();
    }, 3500);
  };

  const handleReset = () => {
    submittedRef.current = false;
    setName('');
    setPhone('');
    setSurgeryArea(event.defaultSurgeryArea);
    setErrorMessage(null);
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  return (
    <section
      id="consult-form-section"
      aria-labelledby={`form-heading-${event.id}`}
      className="scroll-mt-6 rounded-xl border border-[#E6DFD8] bg-white p-6 shadow-sm sm:p-9"
    >
      <iframe
        name={iframeName}
        id={iframeName}
        title="상담 신청 전송 프레임"
        className="hidden"
        onLoad={() => {
          if (submittedRef.current) {
            completeSubmission();
          }
        }}
      />

      {isSuccess ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#6E342D]/10 text-[#6E342D]">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-[#2A1A17] sm:text-2xl">
            상담 신청이 완료되었습니다!
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[#5E4D49] sm:text-base">
            빠른 시일 내에 기재해주신 번호로 연락드리겠습니다.
          </p>
          <div className="mt-6 rounded-lg border border-[#EFE9E2] bg-[#FAF8F6] px-4 py-3 text-xs text-[#5E4D49] tabular-nums">
            신청 이벤트: {event.shortLabel} · 성함: {name} · 연락처: {phone} · 부위: {surgeryArea}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#D7CBC0] bg-white px-5 py-2.5 text-sm font-medium text-[#2A1A17] transition-colors hover:bg-[#FAF8F6] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E342D]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>추가 상담 신청하기</span>
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-[460px]">
          <div className="mb-7 text-center">
            <p className="text-xs font-medium tracking-wide text-[#836350]">
              {event.shortLabel} · {event.priceLabel}
            </p>
            <h3
              id={`form-heading-${event.id}`}
              className="mt-1.5 text-2xl font-bold tracking-tight text-[#2A1A17]"
            >
              상담 및 예약 신청
            </h3>
            <p className="mt-2 text-sm text-[#5E4D49]">{event.formSubtitle}</p>
          </div>

          <form
            id={`consultForm_${event.id}`}
            action={GOOGLE_SCRIPT_ENDPOINT}
            method="POST"
            target={iframeName}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div>
              <label
                htmlFor={`name_${event.id}`}
                className="mb-2 block text-sm font-semibold text-[#3C2B27]"
              >
                이름
              </label>
              <input
                type="text"
                id={`name_${event.id}`}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                required
                autoComplete="name"
                className="min-h-[48px] w-full rounded-lg border border-[#DDD5CE] bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#2A1A17] placeholder:text-[#9A8C87] transition-colors focus:border-[#6E342D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor={`phone_${event.id}`}
                className="mb-2 block text-sm font-semibold text-[#3C2B27]"
              >
                전화번호
              </label>
              <input
                type="tel"
                id={`phone_${event.id}`}
                name="phone"
                value={phone}
                onChange={(e) => setPhone(formatKoreanPhone(e.target.value))}
                placeholder="010-0000-0000"
                required
                autoComplete="tel"
                inputMode="numeric"
                className="min-h-[48px] w-full rounded-lg border border-[#DDD5CE] bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#2A1A17] tabular-nums placeholder:text-[#9A8C87] transition-colors focus:border-[#6E342D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor={`surgery_area_${event.id}`}
                className="mb-2 block text-sm font-semibold text-[#3C2B27]"
              >
                원하는 수술 부위
              </label>
              <select
                id={`surgery_area_${event.id}`}
                name="surgery_area"
                value={surgeryArea}
                onChange={(e) => setSurgeryArea(e.target.value)}
                required
                className="min-h-[52px] w-full cursor-pointer rounded-lg border border-[#DDD5CE] bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#2A1A17] transition-colors focus:border-[#6E342D] focus:bg-white focus:outline-none"
              >
                <option value="">수술 부위를 선택해주세요</option>
                {SURGERY_AREA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between gap-2">
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-xs text-[#5E4D49]">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-[#CBBFB6] accent-[#6E342D]"
                  />
                  <span>개인정보 수집 및 이용 동의 (필수)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPrivacyText((prev) => !prev)}
                  className="text-xs font-medium text-[#836350] underline underline-offset-2 hover:text-[#4E1005] cursor-pointer whitespace-nowrap"
                >
                  {showPrivacyText ? '닫기' : '내용 보기'}
                </button>
              </div>

              {showPrivacyText && (
                <div className="mt-2 rounded-md border border-[#E6DFD8] bg-[#FAF8F6] p-3 text-xs leading-relaxed text-[#5E4D49]">
                  수집 항목: 이름, 전화번호, 희망 수술 부위 · 수집 목적: 캐치성형외과 이벤트 상담
                  및 예약 안내 · 보유 기간: 상담 완료 후 목적 달성 시 지체 없이 파기합니다.
                </div>
              )}
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[54px] w-full rounded-lg bg-[#6E342D] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#4E1005] disabled:cursor-default disabled:bg-[#522722] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E342D]"
            >
              {isSubmitting ? '전송 중...' : '상담 신청하기'}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#836350]">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>캐치성형외과 공식 상담 예약 접수 시스템으로 안전하게 전송됩니다.</span>
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
