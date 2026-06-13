import React from 'react';

const VideoAvatar: React.FC = () => {
  // Aapke official integration code ke hisaab se values
  const agentId = "1bfc8bcc-cb38-46c3-84be-96d2d940790f";
  
  // Inko aap baad mein apne database/login se connect kar sakte hain
  const userName = "Patient"; 
  const userId = "12345";
  const context = "Army_Medical_Consultation"; 

  // Ye raha asli embed URL jo audio block nahi hone dega
  const embedUrl = `https://app.trugen.ai/embed/${agentId}?username=${userName}&id=${userId}&context=${context}`;

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      
      {/* Top Header Bar for Professional Look */}
      <div className="bg-teal-600 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-medium tracking-wide">Live Consultation</span>
        </div>
        <span className="text-sm font-light">Sehat AI Secure Channel</span>
      </div>

      {/* Official TruGen Embed Iframe */}
      <div className="flex-grow w-full bg-gray-50 relative">
        <iframe
          src={embedUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="absolute top-0 left-0 w-full h-full border-none"
          title="Trugen AI Doctor"
        />
      </div>

    </div>
  );
};

// YAHAN HAI ASLI FIX: Maine 'export default' add kar diya hai
export default VideoAvatar;