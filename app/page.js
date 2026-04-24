'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, Search, PlusSquare, ShoppingBag, User, Play, Volume2, VolumeX, Truck, X, Star, Check, Home } from 'lucide-react';
import Image from 'next/image';

export default function BoomPlusDemo() {
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
      product: { name: 'กระทะเหล็กหล่อ Premium', price: 890, originalPrice: 1290, rating: 4.8, sold: '2.1K' }
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
      product: { name: 'เสื้อผ้าฝ้ายลายไทย', price: 450, originalPrice: 690, rating: 4.9, sold: '5.8K' }
    },
    {
      id: 3,
      user: '@tech_niran',
      displayName: 'นิรันดร์ เทคนิค',
      avatar: '👨‍💻',
      description: 'รีวิวหูฟังไร้สาย ราคาไม่เกิน 1,000 🎧 #รีวิวของดี',
      music: '♪ เพลงประกอบ',
      likes: '56.7K',
      comments: '890',
      shares: '234',
      bgGradient: 'from-blue-500 via-cyan-500 to-teal-500',
      emoji: '🎧',
      hasProduct: true,
      product: { name: 'หูฟังไร้สาย T-Pro Max', price: 799, originalPrice: 1299, rating: 4.7, sold: '12.3K' }
    },
  ];

  const shippingOptions = [
    { id: 'flash', name: 'Flash Express', price: 40, time: '1-2 วัน', logo: '⚡' },
    { id: 'kerry', name: 'Kerry Express', price: 45, time: '1-2 วัน', logo: '📦' },
    { id: 'jt', name: 'J&T Express', price: 38, time: '2-3 วัน', logo: '🚚' },
    { id: 'thaipost', name: 'ไปรษณีย์ไทย', price: 32, time: '2-4 วัน', logo: '📮' },
    { id: 'ninja', name: 'Ninja Van', price: 42, time: '1-3 วัน', logo: '🥷' },
  ];

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFollow = (user) => setFollowing(prev => ({ ...prev, [user]: !prev[user] }));

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
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 shadow-lg">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white flex items-center justify-center border border-gray-200">
                  <Image src="/logo.jpg" alt="Boom Plus" width={28} height={28} className="object-cover" />
                </div>
                <span className="text-blue-900 text-xs font-bold tracking-wide">BOOM PLUS</span>
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
                <Heart size={32} className={`${liked[video.id] ? 'fill-red-500 text-red-500' : 'text-white'} transition-all`} strokeWidth={liked[video.id] ? 0 : 2} />
                <span className="text-white text-xs font-semibold">{video.likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <MessageCircle size={30} className="text-white" />
                <span className="text-white text-xs font-semibold">{video.comments}</span>
              </button>

              {video.hasProduct && (
                <button onClick={() => setShowShop(true)} className="flex flex-col items-center gap-1 animate-bounce">
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
                <div key={i} className={`w-1 h-6 rounded-full ${i === currentVideo ? 'bg-white' : 'bg-white/30'}`} />
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="ค้นหาคลิป ผู้ใช้ สินค้า..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none" />
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-3">🔥 เทรนด์วันนี้</h2>
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                {['#กินอะไรดี', '#อาหารไทย', '#OOTD', '#รีวิวของดี', '#สอนทำอาหาร', '#เที่ยวไทย'].map((tag) => (
                  <div key={tag} className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-green-100 rounded-full text-sm font-medium text-blue-800">{tag}</div>
                ))}
              </div>
              <h2 className="font-bold text-lg mb-3">⭐ คลิปแนะนำ</h2>
              <div className="grid grid-cols-2 gap-2">
                {[...videos, ...videos].map((v, i) => (
                  <div key={i} className={`aspect-[9/16] bg-gradient-to-br ${v.bgGradient} rounded-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">{v.emoji}</div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-white text-xs font-medium truncate">{v.user}</div>
                      <div className="flex items-center gap-1 text-white/90 text-xs">
                        <Heart size={10} /> {v.likes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center mb-6 shadow-2xl">
              <PlusSquare size={40} className="text-white" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">สร้างคลิปใหม่</h2>
            <p className="text-gray-400 text-sm text-center mb-8">แชร์ช่วงเวลาของคุณกับคนไทยทั่วประเทศ</p>
            <div className="w-full space-y-3">
              <button className="w-full py-3 bg-white text-black rounded-full font-semibold">📹 ถ่ายวิดีโอใหม่</button>
              <button className="w-full py-3 bg-white/10 text-white rounded-full font-semibold border border-white/20">📁 เลือกจากคลัง</button>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full font-semibold">🛍️ สร้างคลิปพร้อมแท็กสินค้า</button>
            </div>
            <div className="mt-8 text-center text-xs text-gray-500">
              ✨ แท็กสินค้าในคลิปเพื่อขายได้ทันที<br/>ค่าธรรมเนียมเพียง 2% (TikTok 5%+)
            </div>
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="w-full h-full bg-white overflow-y-auto pb-20">
            <div className="sticky top-0 bg-white border-b p-4 z-10">
              <h1 className="font-bold text-xl">ข้อความ</h1>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'สมชาย ครัวไทย', msg: 'ขอบคุณที่สั่งกระทะนะครับ 🙏', time: '2 นาทีที่แล้ว', avatar: '🧑‍🍳', unread: 2 },
                { name: 'มาลี แฟชั่น', msg: 'สินค้าจัดส่งแล้วค่ะ Flash 0023...', time: '1 ชม.', avatar: '👗', unread: 0 },
                { name: 'ระบบ Boom Plus', msg: 'คลิปของคุณมียอดดู 10K แล้ว!', time: '3 ชม.', avatar: '🇹🇭', unread: 1 },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center text-xl">{m.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{m.name}</div>
                    <div className="text-xs text-gray-500 truncate">{m.msg}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">{m.time}</div>
                    {m.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{m.unread}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full h-full bg-white overflow-y-auto pb-20">
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 p-6 pt-8 text-white">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mb-3 shadow-lg overflow-hidden">
                  <Image src="/logo.jpg" alt="Boom Plus" width={80} height={80} className="object-cover" />
                </div>
                <div className="font-bold text-lg">@คุณ</div>
                <div className="text-sm opacity-90 mt-1">พัฒนาแอปสัญชาติไทย 🇹🇭</div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center"><div className="font-bold">128</div><div className="text-xs opacity-80">กำลังติดตาม</div></div>
                  <div className="text-center"><div className="font-bold">2.3K</div><div className="text-xs opacity-80">ผู้ติดตาม</div></div>
                  <div className="text-center"><div className="font-bold">15.2K</div><div className="text-xs opacity-80">ถูกใจ</div></div>
                </div>
                <div className="flex gap-2 mt-4 w-full">
                  <button className="flex-1 py-2 bg-white text-blue-700 rounded-lg font-semibold text-sm">แก้ไขโปรไฟล์</button>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold text-sm">แชร์</button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={18} className="text-blue-700" />
                  <span className="font-bold text-blue-900">ร้านค้าของฉัน</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold text-blue-700">฿12,450</div><div className="text-xs text-gray-600">ยอดขายเดือนนี้</div></div>
                  <div><div className="text-lg font-bold text-blue-700">24</div><div className="text-xs text-gray-600">ออเดอร์</div></div>
                  <div><div className="text-lg font-bold text-green-600">2%</div><div className="text-xs text-gray-600">ค่าธรรมเนียม</div></div>
                </div>
                <button className="w-full mt-3 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold">จัดการร้านค้า →</button>
              </div>
              <div className="flex border-b mb-3">
                <button className="flex-1 py-2 font-semibold border-b-2 border-black">คลิปของฉัน</button>
                <button className="flex-1 py-2 text-gray-400">ถูกใจ</button>
                <button className="flex-1 py-2 text-gray-400">บันทึก</button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {videos.map((v, i) => (
                  <div key={i} className={`aspect-[9/16] bg-gradient-to-br ${v.bgGradient} rounded relative`}>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">{v.emoji}</div>
                    <div className="absolute bottom-1 left-1 text-white text-xs font-semibold">
                      <Play size={10} className="inline" /> {v.likes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showShop && video.hasProduct && (
          <div className="absolute inset-0 bg-black/60 z-30 flex items-end" onClick={() => setShowShop(false)}>
            <div className="w-full bg-white rounded-t-3xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">รายละเอียดสินค้า</h3>
                <button onClick={() => setShowShop(false)}><X size={22} /></button>
              </div>
              <div className="flex gap-3 mb-4">
                <div className={`w-24 h-24 bg-gradient-to-br ${video.bgGradient} rounded-xl flex items-center justify-center text-4xl`}>{video.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm leading-tight">{video.product.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{video.product.rating}</span>
                    <span className="text-xs text-gray-500">· ขายแล้ว {video.product.sold}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-red-500">฿{video.product.price}</span>
                    <span className="text-sm text-gray-400 line-through">฿{video.product.originalPrice}</span>
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">-{Math.round((1 - video.product.price/video.product.originalPrice) * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={16} className="text-blue-700" />
                  <span className="font-semibold text-sm">เลือกขนส่ง</span>
                  <span className="text-xs text-green-600 font-medium">(เลือกได้เอง ✓)</span>
                </div>
                <div className="space-y-2">
                  {shippingOptions.map(opt => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedShipping === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" checked={selectedShipping === opt.id} onChange={() => setSelectedShipping(opt.id)} className="hidden" />
                      <div className="text-2xl">{opt.logo}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{opt.name}</div>
                        <div className="text-xs text-gray-500">{opt.time}</div>
                      </div>
                      <div className="font-bold text-sm">฿{opt.price}</div>
                      {selectedShipping === opt.id && <Check size={18} className="text-blue-600" />}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <div className="text-xs text-green-700 font-semibold mb-1">💚 ซื้อกับ Boom Plus ดีกว่ายังไง</div>
                <ul className="text-xs text-green-800 space-y-0.5">
                  <li>✓ ค่าธรรมเนียมร้านค้าเพียง 2% (ถูกกว่า TikTok ~60%)</li>
                  <li>✓ เลือกขนส่งได้เอง ไม่บังคับ</li>
                  <li>✓ โอนเงินเข้าบัญชีไทยภายใน 24 ชม.</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 border-2 border-blue-600 text-blue-700 rounded-full font-semibold" onClick={() => { alert('เพิ่มในตะกร้าแล้ว! 🛒'); setShowShop(false); }}>เพิ่มในตะกร้า</button>
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full font-semibold" onClick={() => { setShowShop(false); setShowCheckout(true); }}>ซื้อเลย</button>
              </div>
            </div>
          </div>
        )}

        {showCheckout && video.hasProduct && (
          <div className="absolute inset-0 bg-white z-40 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3">
              <button onClick={() => setShowCheckout(false)}><X size={22} /></button>
              <h2 className="font-bold">ยืนยันคำสั่งซื้อ</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-semibold text-sm mb-2">📍 ที่อยู่จัดส่ง</div>
                <div className="text-sm">คุณลูกค้า · 081-234-5678</div>
                <div className="text-xs text-gray-500 mt-1">123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110</div>
              </div>
              <div className="border rounded-xl p-4">
                <div className="flex gap-3">
                  <div className={`w-16 h-16 bg-gradient-to-br ${video.bgGradient} rounded-lg flex items-center justify-center text-2xl`}>{video.emoji}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{video.product.name}</div>
                    <div className="text-xs text-gray-500 mt-1">x1</div>
                    <div className="font-bold text-red-500 mt-1">฿{video.product.price}</div>
                  </div>
                </div>
              </div>
              <div className="border rounded-xl p-4">
                <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Truck size={16} /> ขนส่ง: {shippingOptions.find(s => s.id === selectedShipping)?.name}
                </div>
                <div className="text-xs text-gray-500">ประมาณ {shippingOptions.find(s => s.id === selectedShipping)?.time}</div>
              </div>
              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span>ราคาสินค้า</span><span>฿{video.product.price}</span></div>
                <div className="flex justify-between text-sm"><span>ค่าขนส่ง</span><span>฿{shippingOptions.find(s => s.id === selectedShipping)?.price}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>ยอดรวม</span>
                  <span className="text-red-500">฿{video.product.price + shippingOptions.find(s => s.id === selectedShipping)?.price}</span>
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full font-bold" onClick={() => { alert('สั่งซื้อสำเร็จ! 🎉\n(นี่คือเดโม ยังไม่ตัดเงินจริง)'); setShowCheckout(false); }}>ยืนยันคำสั่งซื้อ</button>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 z-20">
          <div className="flex items-center justify-around py-2 pb-3">
            {[
              { id: 'home', icon: Home, label: 'หน้าแรก' },
              { id: 'discover', icon: Search, label: 'สำรวจ' },
              { id: 'upload', icon: PlusSquare, label: '', special: true },
              { id: 'inbox', icon: MessageCircle, label: 'ข้อความ' },
              { id: 'profile', icon: User, label: 'โปรไฟล์' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              if (tab.special) {
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative">
                    <div className="w-11 h-8 rounded-lg bg-gradient-to-r from-blue-600 via-white to-green-500 flex items-center justify-center shadow-lg">
                      <PlusSquare size={20} className="text-black" strokeWidth={2.5} />
                    </div>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-0.5">
                  <Icon size={22} className={isActive ? 'text-white' : 'text-gray-500'} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] ${isActive ? 'text-white font-semibold' : 'text-gray-500'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}