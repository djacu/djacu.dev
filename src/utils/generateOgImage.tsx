import * as fs from 'fs';
import satori, { SatoriOptions } from "satori";
import { SITE } from "@config";
import { writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const { readFile } = fs.promises;

const fetchFonts = async () => {
  // Regular Font
  const fontRegular = new Uint8Array(await readFile('static/fonts/ibm-plex-mono.regular.ttf'));

  // Bold Font
  const fontBold = new Uint8Array(await readFile('static/fonts/ibm-plex-mono.bold.ttf'));

  return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const fetchBackground = async () => {
  const mime = 'image/png';
  const encoding = 'base64';
  const data = await readFile('static/imgs/waves.png');
  const dataBase64 = data.toString(encoding);
  return  `data:${mime};${encoding},${dataBase64}`;
};


const myOgImage2 = async (text: string, props: object) => {
  const bgImage = await fetchBackground();
  const desc = props.data.description;
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
          width: "88%",
          height: "90%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px",
            width: "90%",
            height: "90%",
          }}
        >
          <p
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#DEE5ED",
              maxHeight: "84%",
              overflow: "hidden",
              textShadow: "2px 2px #3A5069",
            }}
          >
            {text}
          </p>
          <p
            style={{
              position: "absolute",
              top: "50%",
              fontSize: 28,
              fontWeight: "bold",
              color: "#DEE5ED",
              maxHeight: "84%",
              overflow: "hidden",
              textShadow: "2px 2px #3A5069",
            }}
          >
            {desc}
          </p>
          <div
            style={{
              position: "absolute",
              bottom: "0",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
              color: "#DEE5ED",
            }}
          >
            <span
              style={{
                textShadow: "2px 2px #3A5069",
              }}
            >
              by{" "}
              <span
                style={{
                  color: "transparent",
                }}
              >
                "
              </span>
              <span style={{
                overflow: "hidden",
                fontWeight: "bold",
                color: "#DEE5ED",
                textShadow: "2px 2px #3A5069",
              }}>
                {SITE.author}
              </span>
            </span>

            <span style={{
              overflow: "hidden",
              fontWeight: "bold",
              textShadow: "2px 2px #3A5069",
            }}>
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    
    </div>
  );
};

const myOgImage = (text: string) => {
  return (
    <svg
      id="visual"
      viewBox="0 0 1200 630"
      width="1200"
      height="630"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <rect
        x="0"
        y="0"
        width="1200"
        height="630"
        fill="#2C3D50"
      ></rect>
      <path
        d="M0 413L28.5 417.3C57 421.7 114 430.3 171.2 438.2C228.3 446 285.7 453 342.8 456C400 459 457 458 514.2 450C571.3 442 628.7 427 685.8 428C743 429 800 446 857.2 454.3C914.3 462.7 971.7 462.3 1028.8 451C1086 439.7 1143 417.3 1171.5 406.2L1200 395L1200 631L1171.5 631C1143 631 1086 631 1028.8 631C971.7 631 914.3 631 857.2 631C800 631 743 631 685.8 631C628.7 631 571.3 631 514.2 631C457 631 400 631 342.8 631C285.7 631 228.3 631 171.2 631C114 631 57 631 28.5 631L0 631Z"
        fill="#c7d3e0"
      ></path>
      <path
        d="M0 464L28.5 468.7C57 473.3 114 482.7 171.2 483.8C228.3 485 285.7 478 342.8 468.2C400 458.3 457 445.7 514.2 451.2C571.3 456.7 628.7 480.3 685.8 485C743 489.7 800 475.3 857.2 463.3C914.3 451.3 971.7 441.7 1028.8 435.2C1086 428.7 1143 425.3 1171.5 423.7L1200 422L1200 631L1171.5 631C1143 631 1086 631 1028.8 631C971.7 631 914.3 631 857.2 631C800 631 743 631 685.8 631C628.7 631 571.3 631 514.2 631C457 631 400 631 342.8 631C285.7 631 228.3 631 171.2 631C114 631 57 631 28.5 631L0 631Z"
        fill="#a2b0c1"
      ></path>
      <path
        d="M0 485L28.5 489.2C57 493.3 114 501.7 171.2 508.2C228.3 514.7 285.7 519.3 342.8 523.8C400 528.3 457 532.7 514.2 523.2C571.3 513.7 628.7 490.3 685.8 479.2C743 468 800 469 857.2 474.8C914.3 480.7 971.7 491.3 1028.8 500.5C1086 509.7 1143 517.3 1171.5 521.2L1200 525L1200 631L1171.5 631C1143 631 1086 631 1028.8 631C971.7 631 914.3 631 857.2 631C800 631 743 631 685.8 631C628.7 631 571.3 631 514.2 631C457 631 400 631 342.8 631C285.7 631 228.3 631 171.2 631C114 631 57 631 28.5 631L0 631Z"
        fill="#7e8fa3"
      ></path>
      <path
        d="M0 534L28.5 537.8C57 541.7 114 549.3 171.2 551.7C228.3 554 285.7 551 342.8 543.5C400 536 457 524 514.2 518.5C571.3 513 628.7 514 685.8 516.3C743 518.7 800 522.3 857.2 526.7C914.3 531 971.7 536 1028.8 536.7C1086 537.3 1143 533.7 1171.5 531.8L1200 530L1200 631L1171.5 631C1143 631 1086 631 1028.8 631C971.7 631 914.3 631 857.2 631C800 631 743 631 685.8 631C628.7 631 571.3 631 514.2 631C457 631 400 631 342.8 631C285.7 631 228.3 631 171.2 631C114 631 57 631 28.5 631L0 631Z"
        fill="#5b6f85"
      ></path>
      <path
        d="M0 554L28.5 555C57 556 114 558 171.2 565.7C228.3 573.3 285.7 586.7 342.8 590C400 593.3 457 586.7 514.2 586.3C571.3 586 628.7 592 685.8 587.2C743 582.3 800 566.7 857.2 566C914.3 565.3 971.7 579.7 1028.8 586.5C1086 593.3 1143 592.7 1171.5 592.3L1200 592L1200 631L1171.5 631C1143 631 1086 631 1028.8 631C971.7 631 914.3 631 857.2 631C800 631 743 631 685.8 631C628.7 631 571.3 631 514.2 631C457 631 400 631 342.8 631C285.7 631 228.3 631 171.2 631C114 631 57 631 28.5 631L0 631Z"
        fill="#3a5069"
      ></path>
    </svg>
  );
};

const ogImage = (text: string) => {
  return (
    <div
      style={{
        background: "#3A5069",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-1px",
          right: "-1px",
          border: "4px solid #000",
          background: "#C7D3E0",
          opacity: "0.9",
          borderRadius: "120px",
          display: "flex",
          justifyContent: "center",
          margin: "2.5rem",
          width: "88%",
          height: "80%",
        }}
      />

      <div
        style={{
          border: "4px solid #000",
          background: "#2C3D50",
          borderRadius: "120px",
          display: "flex",
          justifyContent: "center",
          margin: "2rem",
          width: "88%",
          height: "80%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "20px",
            width: "90%",
            height: "90%",
          }}
        >
          <p
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#DEE5ED",
              maxHeight: "84%",
              overflow: "hidden",
            }}
          >
            {text}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
              color: "#DEE5ED",
            }}
          >
            <span>
              by{" "}
              <span
                style={{
                  color: "transparent",
                }}
              >
                "
              </span>
              <span style={{
                overflow: "hidden",
                fontWeight: "bold",
                color: "#DEE5ED"
              }}>
                {SITE.author}
              </span>
            </span>

            <span style={{
              overflow: "hidden",
              fontWeight: "bold"
            }}>
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "IBM Plex Mono",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
};

const generateOgImage = async (mytext = SITE.title, props) => {
  const svg = await satori(await myOgImage2(mytext, props), options);

  // render png in production mode
  if (import.meta.env.MODE === "production") {
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    console.info("Output PNG Image  :", `${mytext}.png`);

    await writeFile(`./dist/${mytext}.png`, pngBuffer);
  }

  return svg;
};

export default generateOgImage;
