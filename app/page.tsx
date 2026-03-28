import Navbar from "../components/Navbar";

export default function Home() {
  
  // GÜNCELLENDİ: Gerçek fotoğraf ve video URL'leri eklendi
  const showcaseItems = [
    { title: "Modern Minimalist Tasarım", tag: "#mimari #tasarım", type: "Görsel (Mimari)", media: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80", isVideo: false },
    { title: "Yeni Nesil Setup", tag: "#teknoloji #setup", type: "Video (Teknoloji)", media: "https://cdn.pixabay.com/video/2020/08/13/47137-449581177_tiny.mp4", isVideo: true },
    { title: "Kış Kombinleri", tag: "#moda #tarz", type: "Görsel (Moda)", media: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", isVideo: false },
    { title: "Geleceğin Ofisleri", tag: "#mimari #ofis", type: "Video (Mimari)", media: "https://cdn.pixabay.com/video/2021/08/04/83870-584742721_tiny.mp4", isVideo: true },
    { title: "Günlük Spor Rutini", tag: "#spor #sağlık", type: "Görsel (Spor)", media: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80", isVideo: false },
    { title: "Yazılım Temelleri", tag: "#eğitim #yazılım", type: "Video (Eğitim)", media: "https://cdn.pixabay.com/video/2020/02/20/32624-393282270_tiny.mp4", isVideo: true }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-0 flex flex-col items-center overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-7xl px-6 flex flex-col items-center text-center">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          İçeriğinizi <span className="text-[var(--color-primary)]">Yapay Zeka</span> ile Şekillendirin
        </h1>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl font-medium">
          Mimari, moda, teknoloji veya hobi... Sektörünüz ne olursa olsun, ContentSense AI ile saniyeler içinde etkileyici Reels videoları ve gönderiler oluşturun.
        </p>

        <div className="w-full overflow-hidden pb-20 relative select-none pointer-events-none">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#f3f4f6] to-transparent z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#f3f4f6] to-transparent z-10"></div>
          
          <div className="animate-infinite-scroll flex gap-8">
            {[...showcaseItems, ...showcaseItems].map((item, index) => (
              <div key={index} className="glass-panel w-[320px] h-[568px] flex-shrink-0 flex flex-col relative overflow-hidden rounded-3xl border-2 border-white/60 shadow-xl">
                
                {/* GÜNCELLENDİ: Sıkıcı renkler yerine gerçek medya oynatıcıları */}
                <div className="absolute inset-0 bg-gray-900">
                  {item.isVideo ? (
                    <video src={item.media} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <img src={item.media} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  )}
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white text-left`}>
                  <div className="mb-3 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-xs font-bold shadow-sm">
                    {item.type.includes('Video') ? '🎬 ' : '📸 '} {item.type}
                  </div>
                  <p className="font-extrabold text-2xl leading-tight mb-2 drop-shadow-md">{item.title}</p>
                  <p className="text-sm text-[var(--color-primary)] font-bold drop-shadow-md">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="w-full py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Neden ContentSense AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">💡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">3 Farklı Alternatif</h3>
              <p className="text-gray-600">Tek bir prompt ile yetinmeyin. Sistem size her zaman 3 farklı video veya görsel sunar.</p>
            </div>
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Platforma Özel Üretim</h3>
              <p className="text-gray-600">İçeriğinizin nerede paylaşılacağını seçin. Instagram veya LinkedIn için saniyeler içinde hazır.</p>
            </div>
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sınırsız Düzenleme</h3>
              <p className="text-gray-600">Oluşturulan içeriklerin metinlerini ve görsellerini platform üzerinden anında düzenleyin.</p>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="w-full border-t border-gray-200/50 bg-white/30 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0 font-bold text-gray-800">
            <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-white text-xs">C</div>
            ContentSense AI
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-gray-900 transition-colors">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}