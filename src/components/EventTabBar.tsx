import { useState } from 'react';
import { CATCH_EVENTS, CatchEventData, EventId } from '../data/events';

interface EventTabBarProps {
  activeEventId: EventId;
  onSelectEvent: (id: EventId) => void;
}

function TabThumbnail({ event, isActive }: { event: CatchEventData; isActive: boolean }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className={`flex h-12 w-10 sm:h-14 sm:w-11 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums ${
          isActive ? 'bg-[#6E342D] text-white' : 'bg-[#EFE9E2] text-[#6E342D]'
        }`}
      >
        {event.code}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-10 sm:h-14 sm:w-11 shrink-0 overflow-hidden rounded-md bg-[#EFE9E2]">
      <img
        src={event.thumbnailUrl}
        alt={`${event.shortLabel} 썸네일`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

export function EventTabBar({ activeEventId, onSelectEvent }: EventTabBarProps) {
  return (
    <nav
      aria-label="이벤트 페이지 선택 탭"
      className="border-b border-[#E6DFD8] bg-[#F5F1EC]"
    >
      <div className="mx-auto max-w-[840px] px-3 py-3 sm:px-6 sm:py-4">
        <div
          role="tablist"
          aria-label="캐치성형외과 이벤트 목록"
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {CATCH_EVENTS.map((event) => {
            const isActive = event.id === activeEventId;
            return (
              <button
                key={event.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectEvent(event.id)}
                className={`group flex min-h-[64px] sm:min-h-[72px] w-full flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 rounded-lg border p-2 sm:p-2.5 text-center sm:text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E342D] ${
                  isActive
                    ? 'border-[#6E342D] bg-white shadow-sm ring-1 ring-[#6E342D]/20'
                    : 'border-[#E6DFD8] bg-white/80 hover:border-[#C5B7AD] hover:bg-white'
                }`}
              >
                <TabThumbnail event={event} isActive={isActive} />

                <div className="min-w-0 w-full sm:flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-[10px] sm:text-[11px] font-medium text-[#836350] tabular-nums">
                    <span>{event.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className={isActive ? 'font-semibold text-[#6E342D]' : ''}>
                      {event.priceLabel}
                    </span>
                  </div>
                  <div
                    className={`mt-0.5 truncate text-xs sm:text-sm font-semibold tracking-tight ${
                      isActive ? 'text-[#2A1A17]' : 'text-[#443532] group-hover:text-[#2A1A17]'
                    }`}
                  >
                    {event.shortLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
