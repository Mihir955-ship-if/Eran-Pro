import React from 'react';

interface AdsterraBannerProps {
  className?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  const adHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        overflow: hidden;
        width: 300px;
        height: 250px;
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : 'bc0a9a26a97e773dc9e8cd7135be21b1',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/bc0a9a26a97e773dc9e8cd7135be21b1/invoke.js"></script>
  </body>
</html>`;

  return (
    <div className={`flex flex-col items-center justify-center my-3 ${className}`}>
      <div className="relative w-[304px] min-h-[254px] rounded-2xl bg-slate-950 border border-slate-800/90 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Ad Indicator Badge */}
        <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-3 py-1 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>স্পন্সরড অ্যাড (Sponsored Ad)</span>
          </span>
          <span className="text-amber-400">300×250</span>
        </div>

        {/* 300x250 Sandboxed Iframe with User's Exact HighRevenueFormat / Adsterra Script */}
        <div className="w-[300px] h-[250px] relative bg-slate-950 flex items-center justify-center">
          <iframe
            srcDoc={adHtml}
            title="Eran Pro Sponsored Advertisement"
            width="300"
            height="250"
            scrolling="no"
            frameBorder="0"
            className="w-[300px] h-[250px] border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
          />
        </div>
      </div>
      <div className="text-[10px] text-slate-400 mt-1">
        পুরো সময় বিজ্ঞাপনটি দেখলে স্বয়ংক্রিয়ভাবে কয়েন যুক্ত হবে
      </div>
    </div>
  );
};
