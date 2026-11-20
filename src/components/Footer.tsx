import { useState } from 'react';
import { CLINIC_INFO } from '../data/events';

export function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-[#E6DFD8] bg-[#F5F1EC] text-[#443532]">
      <div className="mx-auto max-w-[840px] px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-3 text-xs leading-relaxed text-[#5E4D49]">
            <div>
              {logoError ? (
                <span className="font-serif text-lg font-semibold tracking-wider text-[#4E1005]">
                  CATCH PLASTIC SURGERY
                </span>
              ) : (
                <img
                  src={CLINIC_INFO.logoUrl}
                  alt="CATCH PLASTIC SURGERY"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="h-9 w-auto object-contain"
                />
              )}
            </div>

            <div className="space-y-1">
              <p>
                {CLINIC_INFO.address} ({CLINIC_INFO.subway})
              </p>
              <p className="tabular-nums">
                대표자 : {CLINIC_INFO.director} · 사업자등록번호 : {CLINIC_INFO.businessNumber} ·
                대표번호 : {CLINIC_INFO.phone} · 팩스 : {CLINIC_INFO.fax}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#836350] tabular-nums sm:text-right">
            <p>
              진료시간: {CLINIC_INFO.hoursWeekday} · {CLINIC_INFO.hoursSaturday} ·{' '}
              {CLINIC_INFO.hoursClosed}
            </p>
            <p className="mt-1.5">
              COPYRIGHT (C) 2026 CATCH Plastic Surgery Clinic. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
