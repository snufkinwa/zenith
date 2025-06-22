import ZenithLogo from '@/components/ui/logo';
import { Linkedin, MessageCircle, Twitter } from 'lucide-react';

const FooterSection = () => {
  return (
    <div>
      {/* Footer with original CSS styling */}
      <footer className="relative z-10 px-4 py-12">
        <div
          className="absolute bottom-0 left-0 h-[100px] w-full border-t-[7px] border-solid"
          style={
            {
              borderImage:
                'linear-gradient(to right, #33cc99 40%, #124dff 60%) 1',
              WebkitMask: 'var(--mask)',
              mask: 'var(--mask)',

              '--slope': '150px',

              '--mask': `radial-gradient(farthest-side, #000 99%, transparent 100%) 50% 0 / 150% calc(var(--slope) * 2) no-repeat, linear-gradient(#000, #000) 0 100% / 100% calc(100% - var(--slope)) no-repeat`,
            } as React.CSSProperties
          }
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 flex items-center gap-4 md:mb-0">
              <ZenithLogo />
              <span className="text-xl font-bold text-[#33cc99]">ZENITH</span>
            </div>

            <div className="flex items-center gap-6">
              <Twitter className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-[#33cc99]" />
              <MessageCircle className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-[#33cc99]" />
              <Linkedin className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-[#33cc99]" />
            </div>
          </div>

          <div className="text-center text-gray-400">
            <p>
              &copy; 2024 Zenith. All rights reserved. Future-proof your coding
              skills.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;
