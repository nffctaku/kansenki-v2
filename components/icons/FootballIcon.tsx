import React from 'react';

export const FootballIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
    <path d="m15.41 15.41-1.41-1.41m-2.83-2.83L9.76 9.76m0 4.48 4.48 0m-4.48-4.48 4.48 0M9.76 14.24l1.41 1.41M12 2v2.5m0 15v2.5M4.22 4.22l1.76 1.76m12.04 12.04 1.76 1.76M2 12h2.5m15 0H22M4.22 19.78l1.76-1.76m12.04-12.04 1.76-1.76" />
  </svg>
);
