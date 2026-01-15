"use client"

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface VideoTestimonial {
  id: number
  name: string
  videoPath: string
}

const VideoTestimonials = () => {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)

  const videoTestimonials: VideoTestimonial[] = [
    {
      id: 1,
      name: "Christian Tille",
      videoPath: "/videos/Christian Tille.MOV"
    },
    {
      id: 2,
      name: "Katrin Kring",
      videoPath: "/videos/Katrin Kring.MOV"
    },
    {
      id: 3,
      name: "Stephan Weist",
      videoPath: "/videos/Stephan Weist.MOV"
    },
    {
      id: 4,
      name: "Thomas Bölz",
      videoPath: "/videos/Thomas Bölz.MOV"
    },
    {
      id: 5,
      name: "Thomas van Kampen",
      videoPath: "/videos/Thomas van Kampen.MOV"
    }
  ]

  const handleVideoClick = (videoId: number, videoElement: HTMLVideoElement) => {
    if (playingVideo === videoId) {
      videoElement.pause()
      setPlayingVideo(null)
    } else {
      // Pause all other videos
      document.querySelectorAll('video').forEach((vid) => {
        if (vid !== videoElement) {
          vid.pause()
        }
      })
      videoElement.play()
      setPlayingVideo(videoId)
    }
  }

  return (
    <>
      <style jsx global>{`
        .video-testimonials-swiper .swiper-pagination {
          position: relative;
          margin-top: 24px;
          bottom: 0;
        }
        .video-testimonials-swiper .swiper-pagination-bullet {
          background-color: rgba(139, 115, 85, 0.3);
          width: 10px;
          height: 10px;
        }
        .video-testimonials-swiper .swiper-pagination-bullet-active {
          background-color: rgba(139, 115, 85, 1);
        }
      `}</style>
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[48px] font-bold text-black font-avenir mb-4">
            Kundenmeinungen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Erfahren Sie, was unsere Kunden über uns sagen
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== 'boolean') {
                const navigation = swiper.params.navigation
                if (navigation) {
                  navigation.prevEl = prevRef.current
                  navigation.nextEl = nextRef.current
                }
              }
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="video-testimonials-swiper"
          >
            {videoTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-[rgba(139,115,85,0.05)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Video Container */}
                  <div className="relative aspect-[9/16] bg-black">
                    <video
                      id={`video-${testimonial.id}`}
                      className="w-full h-full object-cover"
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      onClick={(e) => handleVideoClick(testimonial.id, e.currentTarget)}
                      onPlay={() => setPlayingVideo(testimonial.id)}
                      onPause={() => setPlayingVideo(null)}
                    >
                      <source src={testimonial.videoPath} type="video/quicktime" />
                      <source src={testimonial.videoPath} type="video/mp4" />
                      Ihr Browser unterstützt das Video-Tag nicht.
                    </video>

                    {/* Play Button Overlay - shown when video is not playing */}
                    {playingVideo !== testimonial.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                           onClick={(e) => {
                             const video = document.getElementById(`video-${testimonial.id}`) as HTMLVideoElement
                             if (video) {
                               handleVideoClick(testimonial.id, video)
                             }
                           }}>
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <Play className="w-8 h-8 text-[rgba(139,115,85,1)] ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-[rgba(139,115,85,1)]" />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-[rgba(139,115,85,1)]" />
          </button>
        </div>
      </div>
    </section>
    </>
  )
}

export default VideoTestimonials
