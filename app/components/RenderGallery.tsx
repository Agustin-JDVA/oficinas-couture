"use client";

import {
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import {
  Keyboard,
  Navigation,
} from "swiper/modules";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const renders = [
  "render-01.jpg",
  "render-02.jpg",
  "render-03.jpg",
  "render-04.jpg",
  "render-05.jpg",
  "render-06.jpg",
  "render-07.jpg",
];

export default function RenderGallery() {
  return (
    <section
      id="renders"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <Swiper
        modules={[
          Navigation,
          Keyboard,
        ]}
        navigation
        keyboard={{
          enabled: true,
        }}
        loop={true}
        spaceBetween={10}
        speed={900}
        className="h-full w-full"
      >
        {renders.map(
          (render, index) => (
            <SwiperSlide
              key={render}
              className="h-full w-full"
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit={true}
                limitToBounds={true}
                doubleClick={{
                  disabled: true,
                }}
                wheel={{
                  disabled: true,
                }}
                panning={{
                  disabled: true,
                }}
                pinch={{
                  disabled: false,
                }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={`/renders/${render}`}
                    alt={`Render ${
                      index + 1
                    }`}
                    className="h-screen w-screen select-none object-cover"
                    draggable={false}
                  />
                </TransformComponent>
              </TransformWrapper>
            </SwiperSlide>
          )
        )}
      </Swiper>

      <style jsx global>{`
        #renders
          .swiper-button-prev,
        #renders
          .swiper-button-next {
          color: #ffffff;

          width: 44px;
          height: 44px;

          margin-top: -22px;

          filter:
            drop-shadow(
              0 2px 5px
                rgba(
                  0,
                  0,
                  0,
                  0.45
                )
            );
        }

        #renders
          .swiper-button-prev {
          left: 22px;
        }

        #renders
          .swiper-button-next {
          right: 22px;
        }

        #renders
          .swiper-button-prev::after,
        #renders
          .swiper-button-next::after {
          font-size: 26px;
          font-weight: 400;
        }

        @media (
          max-width: 768px
        ) {
          #renders
            .swiper-button-prev,
          #renders
            .swiper-button-next {
            width: 34px;
            height: 34px;

            margin-top: -17px;
          }

          #renders
            .swiper-button-prev {
            left: 10px;
          }

          #renders
            .swiper-button-next {
            right: 10px;
          }

          #renders
            .swiper-button-prev::after,
          #renders
            .swiper-button-next::after {
            font-size: 20px;
          }
        }
      `}</style>
    </section>
  );
}