import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './Appbackground.sass';

export const Appbackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // console.log("Engine 1", engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log("container 2", container);
  }, []);

  const randomNumber = (num) => {
    Math.floor(Math.random() * num)
  }
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#E6E6FA",
            // value: "#B8CDF8",
          },
          size: "cover"
        },
        ZIndex: -100,
        particles: {
          color: { value: "#FD87AA" },
          move: {
            direction: "bottom",
            enable: true,
            outModes: "out",
            speed: 2
          },
          number: {
            density: {
              enable: true,
              area: 300
            },
            value: 1
          },
          opacity: {
            value: 1
          },
          shape: {
            type: "edge"
          },
          size: {
            value: 10
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 10
          },
          zIndex: {
            value: { min: 0, max: 100 }
          }
        }        
       
      }}
    />
  );
};

export default Appbackground;


 // fpsLimit: 90,
        // interactivity: {
        //   events: {
        //     onClick: {
        //       enable: true,
        //       mode: "push",
        //     },
        //     onHover: {
        //       enable: true,
        //       mode: "repulse",
        //     },
        //     resize: true,
        //   },
        //   modes: {
        //     push: {
        //       quantity: randomNumber(5),
        //     },
        //     repulse: {
        //       distance: 150,
        //       duration: 10,
        //     },
        //   },
        // },
        // particles: {
        //   color: {
        //     value: "#ffffff",
        //   },
        //   links: {
        //     color: "#ffffff",
        //     distance: 150,
        //     enable: true,
        //     opacity: 1,
        //     width: 1,
        //   },
        //   collisions: {
        //     enable: true,
        //   },
        //   move: {
        //     directions: "none",
        //     enable: true,
        //     outModes: {
        //       default: "bounce",
        //     },
        //     random: true,
        //     speed: 1,
        //     straight: false,
        //     direction: "bottom",
        //     gravity: {
        //       enable: true,
        //       acceleration: 10
        //     }
        //   },
        //   number: {
        //     density: {
        //       enable: true,
        //       area: 800,
        //     },
        //     value: 20,
        //   },
        //   opacity: {
        //     value: .9,
        //   },
        //   shape: {
        //     type: "circle",
        //   },
        //   size: {
        //     value: { min: 1, max: 7 },
        //   },
        // },
        // detectRetina: true,