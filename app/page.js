'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, Home, Search, PlusSquare, ShoppingBag, User, Play, Volume2, VolumeX, Truck, X, Star, Check } from 'lucide-react';

export default function ThaiTokDemo() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState({});
  const [following, setFollowing] = useState({});
  const [showShop, setShowShop] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('flash');
  const [muted, setMuted] = useState(true);

  const videos = [
    {
      id: 1,
      user: '@somchai_cook',
      displayName: 'สมชาย ครัวไทย',
      avatar: '🧑‍🍳',
      description: 'ผัดกระเพราไข่ดาว สูตรต้นตำรับ 🌶️🔥 #กินอะไรดี #อาหารไทย',
      music: '♪ เสียงผัดกระทะ - สมชาย',
      likes: '125.4K',
      comments: '2.3K',
      shares: '890',
      bgGradient: 'from-orange-500 via-red-500 to-yellow-500',
      emoji: '🍳',
      hasProduct: true,
      product: {
        name: 'กระทะเหล็กหล่อ Premium',
        price: 890,
        originalPrice: 1290,
        rating: 4.8,
        sold: '2.1K',
      }
    },
    {
      id: 2,
      user: '@malee_fashion',
      displayName: 'มาลี แฟชั่น',
      avatar: '👗',
      description: 'ชุดไทยร่วมสมัย ใส่ได้ทุกโอกาส ✨ #แฟชั่นไทย #OOTD',
      music: '♪ ลาวดวงเดือน Remix',
      likes: '89.2K',
      comments: '1.5K',
      shares: '456',
      bgGradient: 'from-pink-500 via-purple-500 to-indigo-500',
      emoji: '💃',
      hasProduct: true,
      product: {
        name: 'เสื้อผ้าฝ้ายลายไทย',
        price: 450,
        originalPrice: 690,
        rating: 4.9,
        sold: '5.8K',
      }
    },
    {
      id: 3,
      user: '@tech_niran',
      displayName: 'นิรันดร์ เทคนิค',
      avatar: '👨‍💻',
      description: 'รีวิวหูฟังไร้สาย ราคาไม่เกิน 1,000 🎧 #รีวิวของดี',
      music: '♪ เพลงประกอบ - ไม่มีชื่อ',
      likes: '56.7K',
      comments: '890',
      shares: '234',
      bgGradient: 'from-blue-500 via-cyan-500 to-teal-500',
      emoji: '🎧',
      hasProduct: true,
      product: {
        name: 'หูฟังไร้สาย T-Pro Max',
        price: 799,
        originalPrice: 1299,
        rating: 4.7,
        sold: '12.3K',
      }
    },
  ];

  const shippingOptions = [
    { id: 'flash', name: 'Flash Express', price: 40, time: '1-2 วัน', logo: '⚡' },
    { id: 'kerry', name: 'Kerry Express', price: 45, time: '1-2 วัน', logo: '📦' },
    { id: 'jt', name: 'J&T Express', price: 38, time: '2-3 วัน', logo: '🚚' },
    { id: 'thaipost', name: 'ไปรษณีย์ไทย', price: 32, time: '2-4 วัน', logo: '📮' },
    { id: 'ninja', name: 'Ninja Van', price: 42, time: '1-3 วัน', logo: '🥷' },
  ];

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFollow = (user) => {
    setFollowing(prev => ({ ...prev, [user]: !prev[user] }));
  };

  const video = videos[currentVideo];

  useEffect(() => {
    const handleWheel = (e) => {
      if (activeTab !== 'home') return;
      if (e.deltaY > 50 && currentVideo < videos.length - 1) {
        setCurrentVideo(currentVideo + 1);
      } else if (e.deltaY < -50 && currentVideo > 0) {
        setCurrentVideo(currentVideo - 1);
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentVideo, activeTab, videos.length]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center font-sans">
      <div className="relative w-full max-w-sm h-full md:h-[90vh] md:max-h-[800px] bg-black overflow-hidden md:rounded-3xl md:border-4 md:border-gray-800 shadow-2xl">
        
        {activeTab === 'home' && (
          <div className="relative w-full h-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${video.bgGradient} transition-all duration-500`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[150px] opacity-90 animate-pulse">{video.emoji}</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            </div>

            <div className="absolute top-0 left-0 right-0 pt-4 px-4 flex items-center justify-between z-20">
              <div className="flex gap-6 text-white">
                <button className="text-sm font-semibold opacity-70">ติดตาม</button>
                <button className="text-base font-bold border-b-2 border-white pb-1">แนะนำ</button>
              </div>
              <button className="text-white" onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>

            <div className="absolute top-14 left-4 z-20">
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-bold">🇹🇭 BOOM PLUS</span>
              </div>
            </div>

            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-20">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-white flex items-center justify-center text-2xl">
                  {video.avatar}
                </div>
                <button 
                  onClick={() => toggleFollow(video.user)}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold"
                >
                  {following[video.user] ? <Check size={12} /> : '+'}
                </button>
              </div>

              <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1">
                <Heart 
                  size={32} 
                  className={`${liked[video.id] ? 'fill-red-500 text-red-500' : 'text-white'} transition-all`}
                  strokeWidth={liked[video.id] ? 0 : 2}
                />
                <span className="text-white text-xs font-semibold">{video.likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <MessageCircle size={30} className="text-white" />
                <span className="text-white text-xs font-semibold">{video.comments}</span>
              </button>

              {video.hasProduct && (
                <button 
                  onClick={() => setShowShop(true)}
                  className="flex flex-col items-center gap-1 animate-bounce"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <ShoppingBag size={18} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">ช้อป</span>
                </button>
              )}

              <button className="flex flex-col items-center gap-1">
                <Share2 size={28} className="text-white" />
                <span className="text-white text-xs font-semibold">{video.shares}</span>
              </button>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-white flex items-center justify-center animate-spin" style={{animationDuration: '3s'}}>
                <Music size={16} className="text-white" />
              </div>
            </div>

            <div className="absolute bottom-20 left-4 right-20 z-20 text-white">
              <div className="font-bold text-base mb-1">{video.displayName}</div>
              <div className="text-sm mb-2 leading-snug">{video.description}</div>
              <div className="flex items-center gap-2 text-xs">
                <Music size={12} />
                <span className="italic">{video.music}</span>
              </div>
            </div>

            <div className="absolute top-24 right-3 flex flex-col gap-1 z-20">
              {videos.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-6 rounded-full ${i === currentVideo ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>

            {currentVideo === 0 && (
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/70 text-xs animate-bounce z-20">
                ↑ เลื่อนขึ้นเพื่อดูคลิปถัดไป
              </div>
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="w-full h-full bg-white overflow-y-auto pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 border-b z-10">
