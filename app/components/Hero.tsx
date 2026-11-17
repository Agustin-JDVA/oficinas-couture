"use client";

import {
  useRef,
  useState,
} from "react";

type HeroProps = {
  introMode?: boolean;
  isEntering?: boolean;
  onEnter?: () => void;
};

type VideoWithFrameCallback =
  HTMLVideoElement & {
    requestVideoFrameCallback?: (
      callback: () => void
    ) => number;
  };

export default function Hero({
  introMode = false,
  isEntering = false,
  onEnter,
}: HeroProps) {
  const [
    firstVideoFrameReady,
    setFirstVideoFrameReady,
  ] = useState(false);

  const frameCallbackRequested =
    useRef(false);

  const handleVideoPlaying = (
    event: React.SyntheticEvent<
      HTMLVideoElement
    >
  ) => {
    if (
      frameCallbackRequested.current
    ) {
      return;
    }

    frameCallbackRequested.current =
      true;

    const video =
      event.currentTarget as VideoWithFrameCallback;

    if (
      typeof video.requestVideoFrameCallback ===
      "function"
    ) {
      video.requestVideoFrameCallback(
        () => {
          setFirstVideoFrameReady(
            true
          );
        }
      );

      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstVideoFrameReady(
          true
        );
      });
    });
  };

  return (
    <section
      id="inicio"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {introMode ? (
        <>
          {/* RENDER DE PORTADA */}

          <img
            src="/renders/render-01.jpg"
            alt="OFICINAS COUTURE"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* NOMBRE DEL PROYECTO */}

          <div
            className={`intro-project-name-wrapper absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-[750ms] ease-out ${
              isEntering
                ? "-translate-y-3 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="intro-project-name">
              OFICINAS COUTURE
            </div>
          </div>

          {/* BOTÓN INGRESAR */}

          <div
            className={`absolute inset-0 z-10 flex items-center justify-center px-6 transition-all duration-[750ms] ease-out ${
              isEntering
                ? "translate-y-3 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={onEnter}
              disabled={isEntering}
              className="intro-enter-button flex items-center justify-center rounded-full bg-white font-[family:var(--font-wix)] font-medium uppercase text-black shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:pointer-events-none"
            >
              Ingresar al proyecto
            </button>
          </div>
        </>
      ) : (
        <>
          {/* VIDEO INTERIOR */}

          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/renders/render-01.jpg"
            onPlaying={
              handleVideoPlaying
            }
          >
            <source
              src="/video/inicio.mp4"
              type="video/mp4"
            />
          </video>

          {/* LOADER MÓVIL */}

          {!firstVideoFrameReady && (
            <div className="mobile-video-loader">
              <div className="mobile-video-loader-darkness" />

              <div className="mobile-video-loader-ring" />
            </div>
          )}

          {/* DESLIZA PARA RECORRER */}

          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center sm:bottom-12 md:bottom-14">
            <a
              href="#info"
              className="interior-scroll-enter pointer-events-auto flex flex-col items-center text-white"
              aria-label="Ir al concepto"
            >
              <span className="whitespace-nowrap font-[family:var(--font-wix)] text-[10px] font-medium uppercase tracking-[0.24em] text-white drop-shadow-md sm:text-[11px] md:text-[13px]">
                Desliza para recorrer
              </span>

              <div className="scroll-arrow mt-4 flex flex-col items-center">
                <div className="mb-1 h-1.5 w-1.5 rounded-full bg-white" />

                <div className="h-10 w-px bg-white/90 md:h-12" />

                <div className="-mt-[6px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-white" />
              </div>
            </a>
          </div>
        </>
      )}

      <style jsx global>{`
        .intro-project-name-wrapper {
          top: clamp(
            28px,
            3.2vw,
            64px
          );

          width: 100%;

          text-align: center;
        }

        .intro-project-name {
          font-family:
            var(--font-wix),
            Arial,
            sans-serif;

          font-size: clamp(
            33px,
            3vw,
            57px
          );

          font-weight: 900;

          -webkit-text-stroke:
            0.45px #ffffff;

          text-shadow:
            0 1px 2px
            rgba(
              0,
              0,
              0,
              0.18
            );

          line-height: 1;

          letter-spacing:
            0.06em;

          text-transform:
            uppercase;

          color: #ffffff;

          white-space: nowrap;
        }

        .intro-enter-button {
          width: clamp(
            190px,
            16vw,
            280px
          );

          height: clamp(
            44px,
            4.2vw,
            64px
          );

          padding-left: 18px;
          padding-right: 18px;

          font-size: clamp(
            9px,
            0.74vw,
            14px
          );

          line-height: 1;

          letter-spacing: clamp(
            0.12em,
            0.15vw,
            0.18em
          );
        }

        .mobile-video-loader {
          display: none;

          position: absolute;
          inset: 0;

          z-index: 30;

          align-items: center;
          justify-content: center;

          pointer-events: none;
        }

        .mobile-video-loader-darkness {
          position: absolute;
          inset: 0;

          background:
            rgba(
              0,
              0,
              0,
              0.42
            );
        }

        .mobile-video-loader-ring {
          position: relative;
          z-index: 2;

          width: 30px;
          height: 30px;

          border-radius:
            9999px;

          border:
            2px solid
            rgba(
              255,
              255,
              255,
              0.28
            );

          border-top-color:
            #ffffff;

          animation:
            mobileVideoLoading
            0.75s
            linear
            infinite;

          filter:
            drop-shadow(
              0 2px 5px
              rgba(
                0,
                0,
                0,
                0.5
              )
            );
        }

        @keyframes mobileVideoLoading {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        @media (
          hover: none
        ) and (
          pointer: coarse
        ) and (
          max-width: 1024px
        ) {
          .mobile-video-loader {
            display: flex;
          }
        }

        @media (
          orientation: landscape
        ) and (
          max-height: 650px
        ) {
          .intro-project-name-wrapper {
            top: clamp(
              16px,
              4vh,
              26px
            );
          }

          .intro-project-name {
            font-size: clamp(
              25.5px,
              6.75vh,
              33px
            );

            letter-spacing:
              0.05em;

            -webkit-text-stroke:
              0.35px #ffffff;
          }

          .intro-enter-button {
            width: clamp(
              180px,
              32vh,
              215px
            );

            height: clamp(
              40px,
              8vh,
              48px
            );

            font-size: clamp(
              8px,
              1.7vh,
              10px
            );

            letter-spacing:
              0.13em;
          }
        }

        @media (
          orientation: landscape
        ) and (
          max-height: 450px
        ) {
          .intro-project-name-wrapper {
            top: 14px;
          }

          .intro-project-name {
            font-size: 24px;

            letter-spacing:
              0.04em;

            -webkit-text-stroke:
              0.3px #ffffff;
          }

          .intro-enter-button {
            width: 180px;
            height: 40px;

            font-size: 8px;
          }

          .mobile-video-loader-ring {
            width: 24px;
            height: 24px;
          }
        }

        @media (
          max-width: 600px
        ) {
          .intro-project-name-wrapper {
            top: 28px;
          }

          .intro-project-name {
            font-size: clamp(
              27px,
              9vw,
              36px
            );

            letter-spacing:
              0.045em;

            -webkit-text-stroke:
              0.35px #ffffff;
          }
        }

        .interior-scroll-enter {
          animation:
            interiorContentEnter
              1300ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both,
            scrollInvitationFade
              2.4s
              ease-in-out
              1300ms
              infinite;
        }

        .scroll-arrow {
          animation:
            scrollInvitationMove
              1.7s
              ease-in-out
              infinite;

          filter:
            drop-shadow(
              0 2px 4px
              rgba(
                0,
                0,
                0,
                0.45
              )
            );
        }

        @keyframes interiorContentEnter {
          0% {
            opacity: 0;

            transform:
              translateY(
                14px
              );
          }

          35% {
            opacity: 0;
          }

          100% {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        @keyframes scrollInvitationMove {
          0% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(
                12px
              );
          }

          100% {
            transform:
              translateY(0);
          }
        }

        @keyframes scrollInvitationFade {
          0% {
            opacity: 0.72;
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: 0.72;
          }
        }
      `}</style>
    </section>
  );
}