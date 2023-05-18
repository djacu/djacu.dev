import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://djacu.dev/",
  author: "Daniel Baker",
  desc: "A personal site and blog for me.",
  title: "djacu",
  ogImage: "djacu-dev-og.png",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 24,
  height: 24,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/djacu",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:daniel.n.baker@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "FIXME",
    linkTitle: `${SITE.title} on Mastodon`,
    active: true,
  },
];
