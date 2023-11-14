import * as fs from 'fs';

import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const { readFile } = fs.promises;

const fetchBackground = async () => {
  const mime = 'image/png';
  const encoding = 'base64';
  const data = await readFile('static/imgs/waves.png');
  const dataBase64 = data.toString(encoding);
  return  `data:${mime};${encoding},${dataBase64}`;
};

const bgImage = await fetchBackground();

export default (post: CollectionEntry<"blog">) => {
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
                        {post.data.title}
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
                        {post.data.description}
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
                                {post.data.author}
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
}
