"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const plans = [
  {
    name: "Planta Baja",
    src: "/planos/planta baja.jpg",
  },
  {
    name: "Planta Alta",
    src: "/planos/planta alta.jpg",
  },
  {
    name: "Planta Subsuelo",
    src: "/planos/planta subsuelo.jpg",
  },
];

type ImageSize = {
  src: string;
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type PlanLayout = {
  width: number;
  height: number;
};

const sharedButtonStyle = `
  plan-main-button
  flex h-14 w-[215px] items-center justify-center rounded-full bg-white
  font-[family:var(--font-wix)] text-[11px] font-medium uppercase
  tracking-[0.17em] text-black shadow-xl transition-all duration-200
  hover:scale-[1.02] active:scale-95
`;

const PlanControls = ({
  isExploring,
  isDesktop,
  onExit,
  onRotate,
}: {
  isExploring: boolean;
  isDesktop: boolean;
  onExit: () => void;
  onRotate: () => void;
}) => {
  const {
    zoomIn,
    zoomOut,
    resetTransform,
  } = useControls();

  if (!isExploring) return null;

  const handleExit = () => {
    resetTransform(300);
    onExit();
  };

  const handleRotate = () => {
    resetTransform(0);
    onRotate();
  };

  return (
    <>
      {isDesktop && (
        <div className="pointer-events-auto absolute right-5 top-1/2 z-[9998] flex -translate-y-1/2 flex-col gap-2">
          {/* ZOOM IN */}
          <button
            type="button"
            onClick={() =>
              zoomIn(0.45, 250)
            }
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-2xl font-medium text-black shadow-lg transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            aria-label="Acercar plano"
            title="Acercar"
          >
            +
          </button>

          {/* ZOOM OUT */}
          <button
            type="button"
            onClick={() =>
              zoomOut(0.45, 250)
            }
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-2xl font-medium text-black shadow-lg transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            aria-label="Alejar plano"
            title="Alejar"
          >
            −
          </button>

          {/* CENTRAR */}
          <button
            type="button"
            onClick={() =>
              resetTransform(300)
            }
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white font-sans text-[24px] font-normal leading-none text-black shadow-lg transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            aria-label="Centrar plano"
            title="Centrar plano"
          >
            ◎
          </button>

          {/* ROTAR 90 GRADOS */}
          <button
            type="button"
            onClick={handleRotate}
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white font-sans text-[24px] font-normal leading-none text-black shadow-lg transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            aria-label="Rotar plano 90 grados"
            title="Rotar 90°"
          >
            ↻
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleExit}
        className={`pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-1/2 z-[999999] -translate-x-1/2 ${sharedButtonStyle}`}
      >
        Salir del plano
      </button>
    </>
  );
};

const PlanImage = ({
  src,
  name,
  isExploring,
  planWrapperClass,
  layout,
  totalRotation,
  isQuarterTurn,
}: {
  src: string;
  name: string;
  isExploring: boolean;
  planWrapperClass: string;
  layout: PlanLayout;
  totalRotation: number;
  isQuarterTurn: boolean;
}) => {
  const { resetTransform } =
    useControls();

  useEffect(() => {
    if (isExploring) return;

    const section =
      document.getElementById(
        "planos"
      );

    if (!section) return;

    const centerPlan = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resetTransform(0);
        });
      });
    };

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry.isIntersecting &&
            entry.intersectionRatio >=
              0.25 &&
            !isExploring
          ) {
            centerPlan();
          }
        },
        {
          threshold: [
            0.25,
            0.5,
            0.75,
          ],
        }
      );

    observer.observe(section);

    const handleResize = () => {
      if (!isExploring) {
        centerPlan();
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [
    isExploring,
    resetTransform,
  ]);

  const handleImageLoad = () => {
    if (isExploring) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resetTransform(0);
      });
    });
  };

  const imageWidth =
    isQuarterTurn
      ? layout.height
      : layout.width;

  const imageHeight =
    isQuarterTurn
      ? layout.width
      : layout.height;

  return (
    <TransformComponent
      wrapperClass={
        planWrapperClass
      }
      contentClass="plan-content"
    >
      <div
        className="plan-stage"
        style={{
          width: layout.width,
          height: layout.height,
        }}
      >
        <img
          src={src}
          alt={name}
          className="plan-image"
          style={{
            width: imageWidth,
            height: imageHeight,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${totalRotation}deg)`,
          }}
          draggable={false}
          onLoad={handleImageLoad}
        />
      </div>
    </TransformComponent>
  );
};

export default function Plans() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    activePlan,
    setActivePlan,
  ] = useState(0);

  const [
    isPortrait,
    setIsPortrait,
  ] = useState(false);

  const [
    isDesktop,
    setIsDesktop,
  ] = useState(false);

  const [
    isExploring,
    setIsExploring,
  ] = useState(false);

  /*
    ROTACIÓN MANUAL DEL USUARIO.

    0
    90
    180
    270
  */
  const [
    manualRotation,
    setManualRotation,
  ] = useState(0);

  const [
    viewportSize,
    setViewportSize,
  ] = useState<ViewportSize>({
    width: 0,
    height: 0,
  });

  const [
    imageSize,
    setImageSize,
  ] = useState<ImageSize | null>(
    null
  );

  const currentPlan =
    plans[activePlan];

  /*
    ROTACIÓN BASE.

    EN PANTALLA VERTICAL,
    COMO YA HACÍAMOS ANTES,
    EL PLANO PARTE GIRADO
    90 GRADOS A LA IZQUIERDA.
  */

  const baseRotation =
    isPortrait ? -90 : 0;

  /*
    ROTACIÓN TOTAL:

    ROTACIÓN AUTOMÁTICA
    +
    ROTACIÓN DEL USUARIO.
  */

  const totalRotation =
    baseRotation +
    manualRotation;

  /*
    NORMALIZAMOS EL ÁNGULO
    ENTRE 0 Y 359.
  */

  const normalizedRotation =
    ((totalRotation % 360) +
      360) %
    360;

  /*
    SI ESTÁ A 90 O 270 GRADOS,
    ANCHO Y ALTO SE INTERCAMBIAN.
  */

  const isQuarterTurn =
    normalizedRotation === 90 ||
    normalizedRotation === 270;

  /*
    DETECTAMOS ORIENTACIÓN
    Y TIPO DE DISPOSITIVO.
  */

  useEffect(() => {
    const orientationQuery =
      window.matchMedia(
        "(orientation: portrait)"
      );

    const desktopQuery =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      );

    const updateOrientation =
      () => {
        setIsPortrait(
          orientationQuery.matches
        );

        /*
          AL CAMBIAR LA ORIENTACIÓN
          DEL DISPOSITIVO VOLVEMOS
          A LA ROTACIÓN INICIAL.
        */
        setManualRotation(0);
      };

    const updateDesktop = () => {
      setIsDesktop(
        desktopQuery.matches
      );

      setIsExploring(false);
    };

    updateOrientation();
    updateDesktop();

    orientationQuery.addEventListener(
      "change",
      updateOrientation
    );

    desktopQuery.addEventListener(
      "change",
      updateDesktop
    );

    return () => {
      orientationQuery.removeEventListener(
        "change",
        updateOrientation
      );

      desktopQuery.removeEventListener(
        "change",
        updateDesktop
      );
    };
  }, []);

  /*
    MEDIMOS EL ESPACIO REAL
    DE LA SECCIÓN.
  */

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) return;

    const updateViewportSize = () => {
      const width =
        section.clientWidth;

      const height =
        section.clientHeight;

      setViewportSize((previous) => {
        if (
          previous.width === width &&
          previous.height === height
        ) {
          return previous;
        }

        return {
          width,
          height,
        };
      });
    };

    updateViewportSize();

    const observer =
      new ResizeObserver(() => {
        updateViewportSize();
      });

    observer.observe(section);

    window.addEventListener(
      "resize",
      updateViewportSize
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateViewportSize
      );
    };
  }, []);

  /*
    LEEMOS EL TAMAÑO ORIGINAL
    DEL JPG ACTUAL.
  */

  useEffect(() => {
    let cancelled = false;

    const image =
      new window.Image();

    const handleLoad = () => {
      if (cancelled) return;

      if (
        image.naturalWidth <= 0 ||
        image.naturalHeight <= 0
      ) {
        return;
      }

      setImageSize({
        src: currentPlan.src,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onload = handleLoad;

    image.src =
      currentPlan.src;

    if (
      image.complete &&
      image.naturalWidth > 0
    ) {
      handleLoad();
    }

    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [currentPlan.src]);

  /*
    CALCULAMOS EL TAMAÑO
    DEL PLANO PARA CUBRIR
    COMPLETAMENTE LA PANTALLA.

    SI EL PLANO ESTÁ GIRADO
    90 O 270 GRADOS,
    INTERCAMBIAMOS ANCHO Y ALTO.
  */

  const calculatePlanLayout =
    (): PlanLayout | null => {
      if (
        !imageSize ||
        imageSize.src !==
          currentPlan.src ||
        viewportSize.width <= 0 ||
        viewportSize.height <= 0
      ) {
        return null;
      }

      const naturalWidth =
        isQuarterTurn
          ? imageSize.height
          : imageSize.width;

      const naturalHeight =
        isQuarterTurn
          ? imageSize.width
          : imageSize.height;

      const horizontalScale =
        viewportSize.width /
        naturalWidth;

      const verticalScale =
        viewportSize.height /
        naturalHeight;

      const coverScale =
        Math.max(
          horizontalScale,
          verticalScale
        );

      const safeScale =
        coverScale * 1.002;

      return {
        width: Math.ceil(
          naturalWidth *
            safeScale
        ),

        height: Math.ceil(
          naturalHeight *
            safeScale
        ),
      };
    };

  const planLayout =
    calculatePlanLayout();

  /*
    BLOQUEAMOS EL SCROLL
    DURANTE LA EXPLORACIÓN.
  */

  useEffect(() => {
    if (!isExploring) {
      document.body.classList.remove(
        "plan-exploring-active"
      );

      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    document.body.classList.add(
      "plan-exploring-active"
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.body.classList.remove(
        "plan-exploring-active"
      );
    };
  }, [isExploring]);

  /*
    CAMBIAR DE PLANO.
  */

  const handleChangePlan = (
    index: number
  ) => {
    setIsExploring(false);

    setManualRotation(0);

    setActivePlan(index);
  };

  /*
    ROTAR 90 GRADOS.
  */

  const handleRotatePlan = () => {
    setManualRotation(
      (previous) =>
        (previous + 90) % 360
    );
  };

  /*
    SALIR DEL MODO EXPLORAR.
  */

  const handleExitPlan = () => {
    setIsExploring(false);

    /*
      AL SALIR RECUPERAMOS
      LA ORIENTACIÓN ORIGINAL.
    */
    setManualRotation(0);
  };

  const planWrapperClass =
    isExploring
      ? "plan-wrapper plan-exploring"
      : "plan-wrapper";

  /*
    CENTRAMOS EL PLANO
    YA ESCALADO.
  */

  const initialPositionX =
    planLayout
      ? (viewportSize.width -
          planLayout.width) /
        2
      : 0;

  const initialPositionY =
    planLayout
      ? (viewportSize.height -
          planLayout.height) /
        2
      : 0;

  return (
    <section
      ref={sectionRef}
      id="planos"
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      {/*
        VISTA PROVISIONAL
        MIENTRAS CARGA
        EL TAMAÑO DEL JPG.
      */}

      {!planLayout && (
        <div className="plan-loading-preview">
          <img
            src={currentPlan.src}
            alt={currentPlan.name}
            className={
              isPortrait
                ? "plan-loading-image plan-loading-image-portrait"
                : "plan-loading-image"
            }
            draggable={false}
          />
        </div>
      )}

      {planLayout && (
        <TransformWrapper
          /*
            AL ROTAR CAMBIAMOS LA KEY.

            ESTO HACE QUE EL PLANO
            SE RECENTRE AUTOMÁTICAMENTE
            EN SU NUEVA ORIENTACIÓN.
          */
          key={`${activePlan}-${isPortrait ? "portrait" : "landscape"}-${isDesktop ? "desktop" : "touch"}-${manualRotation}-${planLayout.width}-${planLayout.height}`}
          initialScale={1}
          minScale={1}
          maxScale={6}
          initialPositionX={
            initialPositionX
          }
          initialPositionY={
            initialPositionY
          }
          centerOnInit={false}
          disablePadding={true}
          limitToBounds={true}
          centerZoomedOut={false}
          velocityAnimation={{
            disabled: true,
          }}
          wheel={{
            disabled:
              !isDesktop ||
              !isExploring,
            step: 0.2,
          }}
          doubleClick={{
            disabled:
              !isExploring,
            mode: "reset",
            animationTime: 300,
          }}
          panning={{
            disabled:
              !isExploring,
            velocityDisabled: true,
          }}
          pinch={{
            disabled:
              !isExploring,
            allowPanning: true,
          }}
        >
          <PlanControls
            isExploring={
              isExploring
            }
            isDesktop={
              isDesktop
            }
            onRotate={
              handleRotatePlan
            }
            onExit={
              handleExitPlan
            }
          />

          <PlanImage
            src={currentPlan.src}
            name={currentPlan.name}
            isExploring={
              isExploring
            }
            planWrapperClass={
              planWrapperClass
            }
            layout={planLayout}
            totalRotation={
              totalRotation
            }
            isQuarterTurn={
              isQuarterTurn
            }
          />
        </TransformWrapper>
      )}

      {/* BOTÓN EXPLORAR */}

      {!isExploring && (
        <div className="pointer-events-none absolute inset-0 z-[9997] flex items-center justify-center">
          <button
            type="button"
            onClick={() =>
              setIsExploring(true)
            }
            className={`pointer-events-auto ${sharedButtonStyle}`}
          >
            Explorar plano
          </button>
        </div>
      )}

      {/* SELECTOR DE PLANOS */}

      {!isExploring && (
        <div className="plan-selector-wrapper pointer-events-none absolute bottom-8 left-1/2 z-[9998] flex -translate-x-1/2 items-center gap-3 sm:bottom-10">
          {plans.map(
            (plan, index) => (
              <button
                key={plan.src}
                type="button"
                onClick={() =>
                  handleChangePlan(
                    index
                  )
                }
                className={`plan-selector-button pointer-events-auto whitespace-nowrap rounded-full font-[family:var(--font-wix)] font-medium uppercase shadow-lg transition-all duration-300 ${
                  activePlan ===
                  index
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                <span className="plan-selector-text">
                  {plan.name}
                </span>
              </button>
            )
          )}
        </div>
      )}

      <style jsx global>{`
        /*
          SELECTOR DESKTOP
        */

        .plan-selector-button {
          min-width: 145px;

          padding:
            12px 28px;
        }

        .plan-selector-text {
          font-size: 9px !important;

          line-height: 1 !important;

          letter-spacing:
            0.1em !important;
        }

        /*
          ÁREA VISIBLE DEL PLANO
        */

        .plan-wrapper {
          width: 100% !important;
          height: 100% !important;

          overflow: hidden !important;

          touch-action: pan-y;
        }

        .plan-wrapper.plan-exploring {
          cursor: grab !important;

          touch-action: none !important;

          overscroll-behavior: none;
        }

        .plan-wrapper.plan-exploring:active {
          cursor: grabbing !important;
        }

        /*
          CONTENIDO DEL TRANSFORM
        */

        .plan-content {
          display: block !important;

          width: max-content !important;
          height: max-content !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        /*
          ESCENARIO DEL PLANO
        */

        .plan-stage {
          position: relative;

          display: block;

          flex: none;

          margin: 0 !important;
          padding: 0 !important;

          overflow: hidden;
        }

        /*
          IMAGEN DEL PLANO

          AHORA SIEMPRE PARTE
          DESDE EL CENTRO.

          ESTO NOS PERMITE
          ROTARLA 0, 90, 180
          O 270 GRADOS SIN
          DESPLAZARLA.
        */

        .plan-image {
          position: absolute !important;

          display: block !important;

          max-width: none !important;
          max-height: none !important;

          margin: 0 !important;
          padding: 0 !important;

          object-fit: fill;

          transform-origin:
            center center !important;

          user-select: none;

          -webkit-user-select: none;
          -webkit-user-drag: none;

          pointer-events: none;
        }

        /*
          VISTA PROVISIONAL
        */

        .plan-loading-preview {
          position: absolute;
          inset: 0;

          overflow: hidden;

          background: white;
        }

        .plan-loading-image {
          position: absolute;

          width: 100%;
          height: 100%;

          object-fit: cover;

          user-select: none;

          -webkit-user-drag: none;
        }

        .plan-loading-image-portrait {
          width: 100vh;
          height: 100vw;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%)
            rotate(-90deg);
        }

        /*
          MÓVILES Y PANTALLAS
          TÁCTILES
        */

        @media (
          hover: none
        ) and (
          pointer: coarse
        ) and (
          max-width: 1024px
        ) {
          .plan-main-button {
            width: 160px !important;
            height: 39px !important;

            font-size: 8.5px !important;

            letter-spacing:
              0.12em !important;
          }

          .plan-selector-wrapper {
            bottom: 18px !important;

            gap: 4px !important;
          }

          .plan-selector-button {
            min-width: 0 !important;
            width: auto !important;

            height: 28px !important;

            padding:
              0 8px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;
          }

          .plan-selector-text {
            font-size: 7.5px !important;

            line-height: 1 !important;

            letter-spacing:
              0.08em !important;
          }
        }

        /*
          CELULAR MUY ANGOSTO
        */

        @media (
          hover: none
        ) and (
          pointer: coarse
        ) and (
          max-width: 390px
        ) {
          .plan-selector-wrapper {
            gap: 3px !important;
          }

          .plan-selector-button {
            min-width: 0 !important;
            width: auto !important;

            height: 26px !important;

            padding:
              0 6px !important;
          }

          .plan-selector-text {
            font-size: 7.5px !important;
          }
        }

        /*
          CELULAR HORIZONTAL
        */

        @media (
          orientation: landscape
        ) and (max-height: 500px) {
          .plan-main-button {
            width: 155px !important;
            height: 37px !important;

            font-size: 8px !important;

            letter-spacing:
              0.12em !important;
          }

          .plan-selector-wrapper {
            bottom: 10px !important;

            gap: 4px !important;
          }

          .plan-selector-button {
            min-width: 0 !important;
            width: auto !important;

            height: 26px !important;

            padding:
              0 7px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;
          }

          .plan-selector-text {
            font-size: 7px !important;

            line-height: 1 !important;

            letter-spacing:
              0.07em !important;
          }
        }
      `}</style>
    </section>
  );
}