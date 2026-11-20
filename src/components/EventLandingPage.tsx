import { useState } from 'react';
import { CatchEventData } from '../data/events';
import { ConsultationForm } from './ConsultationForm';

interface EventLandingPageProps {
  event: CatchEventData;
}

function DetailImageBlock({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center bg-[#F5F1EC] p-8 text-center">
        <p className="text-sm text-[#5E4D49]">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="block w-full h-auto"
    />
  );
}

export function EventLandingPage({ event }: EventLandingPageProps) {
  return (
    <main className="mx-auto max-w-[840px] px-3 pt-4 pb-20 sm:px-6 sm:pt-6 sm:pb-16">
      <div className="space-y-8">
        <article
          aria-label={`${event.shortLabel} 상세 안내`}
          className="overflow-hidden rounded-xl border border-[#E6DFD8] bg-white shadow-sm"
        >
          {event.detailImages.map((imgSrc, idx) => (
            <DetailImageBlock
              key={imgSrc}
              src={imgSrc}
              alt={`${event.shortLabel} 이벤트 상세 이미지 ${idx + 1}`}
            />
          ))}
        </article>

        <ConsultationForm key={event.id} event={event} />
      </div>
    </main>
  );
}
