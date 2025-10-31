"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Swiper as SwiperType } from "swiper"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Testimonial {
  id: number
  name: string
  rating: number
  text: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    text: "Ich bin begeistert von der Qualität und dem Service! Die Weine von Liebig erhalten höchste Von Preisgestaltung bis hin zu exzellenten Produkten hat jedes Stück, das ich bei Ihnen kaufe, meine Erwartungen übertroffen!",
    verified: true,
  },
  {
    id: 2,
    name: "Alex K.",
    rating: 5,
    text: "Es war Früher eine Herausforderung, Bestellung ist bei mir immer reibungslos. Seit entspricht. Sie zu Liebig entdeckte. Die Weine sind von höchster Qualität und die Wir sind so zufrieden! Kann jedem ein Besuch von Geschäftsbeziehung und Anbieter an.",
    verified: true,
  },
  {
    id: 3,
    name: "James D.",
    rating: 5,
    text: "Als jemand, der immer auf der Suche nach einzigartigen Marktanteilen ist, bin ich begeistert. Liebig entdeckt zu haben. Die Auswahl an Erzeugnissen ist nicht nur vielfältig, sondern auch im Einklang mit den neuesten Trends.",
    verified: true,
  },
  {
    id: 4,
    name: "Maria S.",
    rating: 5,
    text: "Die Qualität der Weine ist außergewöhnlich und der Kundenservice ist erstklassig. Jede Bestellung wird schnell und sicher geliefert. Ich kann Liebig nur weiterempfehlen!",
    verified: true,
  },

   {
    id: 5,
    name: "Maria S.",
    rating: 5,
    text: "Die Qualität der Weine ist außergewöhnlich und der Kundenservice ist erstklassig. Jede Bestellung wird schnell und sicher geliefert. Ich kann Liebig nur weiterempfehlen!",
    verified: true,
  },

   {
    id: 6,
    name: "Maria S.",
    rating: 5,
    text: "Die Qualität der Weine ist außergewöhnlich und der Kundenservice ist erstklassig. Jede Bestellung wird schnell und sicher geliefert. Ich kann Liebig nur weiterempfehlen!",
    verified: true,
  },
]

export default function CustomerTestimonials() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[48px] font-bold text-black font-avenir leading-tight inline-block">
            UNSERE ZUFRIEDENEN KUNDEN
          </h2>
        </div>

        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex items-center justify-end gap-2 mb-8 absolute top-16 right-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-[rgba(139,115,85,0.1)] border-0"
              onClick={() => swiperRef?.slidePrev()}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-[rgba(139,115,85,0.1)] border-0"
              onClick={() => swiperRef?.slideNext()}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
        </div>

        {/* Testimonials Swiper */}
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-gray-300",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-black",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-[rgba(139,115,85,0.05)] p-6 rounded-lg h-full flex flex-col">
                {/* Stars */}
                <div className="flex items-center mb-4">{renderStars(testimonial.rating)}</div>

                {/* Customer Name with Verification */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold text-black">{testimonial.name}</span>
                  {testimonial.verified && (
                    <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed flex-1">{testimonial.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile Navigation Arrows */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-[rgba(139,115,85,0.1)] border-0"
            onClick={() => swiperRef?.slidePrev()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-[rgba(139,115,85,0.1)] border-0"
            onClick={() => swiperRef?.slideNext()}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

     
    </section>
  )
}


