// Legal pages. The public brand is "Eris"; the legal entity is "Eris Labs".
// Written to match how this site actually works: static pages, no cookies,
// no analytics or ad trackers, self-hosted fonts, hosted on Vercel, contact by email.
// Have these reviewed by a lawyer before relying on them.
import { site } from './content.js';

const L = site.legalName;
const E = site.email;
export const legalUpdated = 'November 20, 2026';

export const legalDocs = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: `How ${L} handles information when you visit this website or contact us.`,
    sections: [
      ['Who we are', [`This website is operated by ${L} (“${L}”, “we”, “us”) under the name ${site.name}. ${L} is an independent AI research lab. If you have any question about this policy, email us at ${E}.`]],
      ['What this website collects', [`This website does not use cookies, analytics, advertising trackers or third‑party scripts, and its fonts are served from our own site. We do not build profiles of visitors.`]],
      ['Hosting and server logs', ['The site is hosted by Vercel. To deliver and protect the site, our hosting provider processes standard technical information such as your IP address, browser type, the pages you request and the time of the request. This processing is governed by Vercel’s own privacy policy.']],
      ['When you email us', [`If you email ${E}, we receive your email address and whatever you choose to include. We use it only to read and reply to your message and to keep a record of our correspondence.`, 'We do not sell it, we do not share it for marketing, and we do not use the contents of your emails to train AI models.']],
      ['How long we keep it', ['We keep correspondence for as long as it is useful for the conversation or required by law. You can ask us to delete it at any time.']],
      ['Your choices and rights', [`You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${E}. Depending on where you live, you may have additional rights under local data protection law, and you may contact your local data protection authority.`]],
      ['Our research', ['The research described on this site concerns privacy‑first AI, personal context and memory. Nothing on this website collects personal context for that research.']],
      ['Children', ['This website is not directed at children under 13, and we do not knowingly collect information from them.']],
      ['Changes to this policy', ['If we change how we handle information, we will update this page and the date below.']],
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    summary: `The terms that apply when you use the ${site.name} website.`,
    sections: [
      ['Agreement', [`These terms apply to your use of this website, which is operated by ${L}. By using the site, you agree to them. If you don’t agree, please don’t use the site.`]],
      ['What this website is', [`The site describes the research of ${L}. Projects, open questions and directions described here are research and development work. They are not offers of products or services, and nothing on the site is a promise that any project will be released.`]],
      ['Our content', [`Unless stated otherwise, the text, design, logo and generated visuals on this site belong to ${L}. You may link to the site and quote short excerpts with attribution to ${site.name}. Please ask before reusing anything else. The photograph of the Golden Gate Bridge is in the public domain.`]],
      ['Acceptable use', ['Please don’t interfere with the site, attempt to access it in ways it isn’t designed for, or use it for anything unlawful.']],
      ['No warranties', ['The site and its content are provided “as is”. Research descriptions are our current thinking and may change. We do our best to keep the site accurate and available, but we don’t guarantee that it is complete, current or error‑free.']],
      ['Limitation of liability', [`To the fullest extent permitted by law, ${L} is not liable for any indirect or consequential loss arising from your use of the site. Nothing in these terms limits liability that cannot be limited by law.`]],
      ['Links to other sites', ['If we link to other websites, we are not responsible for their content or practices.']],
      ['Trademarks', [`${site.name}, ${L} and the ${site.name} logo are trademarks of ${L}. See our trademark guidelines for how they may be used.`]],
      ['Changes to these terms', ['We may update these terms from time to time. The date below shows when they last changed.']],
      ['Contact', [`Questions about these terms? Email ${E}.`]],
    ],
  },
  {
    slug: 'trademarks',
    title: 'Trademark Guidelines',
    summary: `How to refer to ${site.name} and ${L}, and how not to.`,
    sections: [
      ['Our marks', [`“${site.name}”, “${L}” and the ${site.name} logo (a planet with its ring and a small moon) are trademarks of ${L}.`]],
      ['What’s fine', ['Referring to us by name in articles, research, talks and conversation.', `Linking to this website, or saying that something works with or is inspired by ${site.name}, as long as it’s accurate.`]],
      ['Please don’t', ['Suggest that we sponsor, endorse or partner with you unless we have agreed to that in writing.', 'Use our names or logo as part of your own product, company, app or domain name.', 'Modify, animate or recolour the logo, or combine it with other marks.', 'Use names or logos that are confusingly similar to ours.']],
      ['Project names', ['Photon, Comet, Nebula and Horizon are names we use for lines of research. They describe work in progress, not released products.']],
      ['Other marks', ['Any other trademarks mentioned on this site belong to their respective owners.']],
      ['Asking for permission', [`For anything not covered here, email ${E} and we’ll get back to you.`]],
    ],
  },
];
