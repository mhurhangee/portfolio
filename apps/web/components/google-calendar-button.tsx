// /home/mjh/front/apps/web/components/google-calendar-button.tsx
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface GoogleCalendarButtonProps {
  url?: string;
  color?: string;
  label?: string;
  className?: string;
}

export function GoogleCalendarButton({
  url = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0YL1un_4T9gcy-mkI_ujsYFTeOY48eS7UyElDWH4Iono4NmkFp759ibLalxQpISv9YNzpovS4S?gv=true",
  color = "#000000",
  label = "Book your free consultation",
  className,
}: GoogleCalendarButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for the calendar script to be available
    const handleLoad = () => {
      if (
        window.calendar &&
        window.calendar.schedulingButton &&
        buttonRef.current
      ) {
        window.calendar.schedulingButton.load({
          url,
          color,
          label,
          target: buttonRef.current,
        });
      }
    };

    // Initialize if calendar is already loaded
    if (window.calendar && window.calendar.schedulingButton) {
      handleLoad();
    } else {
      // Otherwise wait for load event
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [url, color, label]);

  return (
    <>
      <Script src="https://calendar.google.com/calendar/scheduling-button-script.js" strategy="lazyOnload" />
      <link href="https://calendar.google.com/calendar/scheduling-button-script.css" rel="stylesheet" />
      <div ref={buttonRef} className={className}></div>
    </>
  );
}

// Add TypeScript declaration
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}