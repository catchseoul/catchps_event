import { useCallback, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { CATCH_EVENTS, EventId } from './data/events';
import { EventTabBar } from './components/EventTabBar';
import { EventLandingPage } from './components/EventLandingPage';
import { Footer } from './components/Footer';

const VALID_EVENT_IDS = new Set<EventId>(CATCH_EVENTS.map((e) => e.id));

function getInitialEventId(): EventId {
  if (typeof window === 'undefined') return 'first-nose';
  const hash = window.location.hash.replace(/^#/, '') as EventId;
  if (VALID_EVENT_IDS.has(hash)) return hash;
  const param = new URLSearchParams(window.location.search).get('event') as EventId | null;
  if (param && VALID_EVENT_IDS.has(param)) return param;
  return 'first-nose';
}

export default function App() {
  const [activeEventId, setActiveEventId] = useState<EventId>(getInitialEventId);

  const activeEvent =
    CATCH_EVENTS.find((ev) => ev.id === activeEventId) ?? CATCH_EVENTS[0];

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') as EventId;
      if (VALID_EVENT_IDS.has(hash)) {
        setActiveEventId(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = `캐치성형외과 이벤트 페이지 | ${activeEvent.shortLabel}`;
  }, [activeEvent.shortLabel]);

  const handleSelectEvent = useCallback((id: EventId) => {
    setActiveEventId(id);
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleJumpToForm = useCallback(() => {
    const target = document.getElementById('consult-form-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[#FAF8F6] text-[#2A1A17]">
      <EventTabBar
        activeEventId={activeEventId}
        onSelectEvent={handleSelectEvent}
      />

      <EventLandingPage key={activeEvent.id} event={activeEvent} />

      <Footer />

      {/* Desktop Quick Jump to Form */}
      <button
        type="button"
        onClick={handleJumpToForm}
        className="hidden md:inline-flex fixed bottom-6 right-6 z-30 min-h-[46px] items-center gap-2 rounded-lg bg-[#6E342D] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4E1005] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E342D]"
      >
        <span>상담 신청하기</span>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Mobile Bottom Quick Consultation Bar (56px height, <15% mobile viewport cap) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between gap-3 border-t border-[#E6DFD8] bg-white/95 px-4 backdrop-blur-sm md:hidden">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-[#2A1A17]">
            {activeEvent.shortLabel}
          </div>
          <div className="truncate text-[11px] font-medium text-[#6E342D] tabular-nums">
            {activeEvent.priceLabel} · 추가금 없음
          </div>
        </div>
        <button
          type="button"
          onClick={handleJumpToForm}
          className="min-h-[40px] shrink-0 rounded-md bg-[#6E342D] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4E1005] whitespace-nowrap cursor-pointer"
        >
          상담 신청하기
        </button>
      </div>
    </div>
  );
}
