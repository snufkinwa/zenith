import ZenithLogo from "@/components/ui/logo";
import { Linkedin, MessageCircle, Twitter } from "lucide-react";

     
     
const FooterSection = () => {
  return (
    <div>
     {/* Footer with original CSS styling */}
      <footer className="relative z-10 py-12 px-4">
        <div 
          className="absolute left-0 bottom-0 w-full h-[100px] border-t-[7px] border-solid"
          style={{
            borderImage: 'linear-gradient(to right, #33cc99 40%, #124dff 60%) 1',
            WebkitMask: 'var(--mask)',
            mask: 'var(--mask)',
    
            '--slope': '150px',
      
            '--mask': `radial-gradient(farthest-side, #000 99%, transparent 100%) 50% 0 / 150% calc(var(--slope) * 2) no-repeat, linear-gradient(#000, #000) 0 100% / 100% calc(100% - var(--slope)) no-repeat`,
          } as React.CSSProperties}
        />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <ZenithLogo />
              <span className="text-xl font-bold text-[#33cc99]">ZENITH</span>
            </div>

            <div className="flex items-center gap-6">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
              <MessageCircle className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-center text-gray-400">
            <p>&copy; 2024 Zenith. All rights reserved. Future-proof your coding skills.</p>
          </div>
        </div>
      </footer>
    </div>)
}

export default FooterSection