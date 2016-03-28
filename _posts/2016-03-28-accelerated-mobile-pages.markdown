---
layout: post
title:  "Accelerated Mobile Pages"
permalink: "/:title"
sub-title: ""
date:   2016-03-28 10:03:10
categories: 
    - css
    - html
---

<figure><amp-img src="/images/amp.gif"
      width="800"
      height="299"
      layout="responsive"
      alt="a vanity shot of Max">
</amp-img>
<figcaption>Photo Credit: <a href="http://codecanyon.net/item/accelerated-mobile-pages-amp-for-wordpress/14825063">codecanyon.net</a></figcaption>
</figure>

---

> AMP HTML is HTML with some restrictions for reliable performance and some extensions for building rich content beyond basic HTML. The AMP JS library ensures the fast rendering of AMP HTML pages. The Google AMP Cache (optionally) delivers the AMP HTML pages.

Last October, Google announced the introduction of its Accelerated Mobile Pages project, a new open-source initiative aiming to “dramatically improve the performance of the mobile web.”

For severarl reasons I decided to give AMP a runthrough on my own site. Firstly, my site is almost entirely static - making it a perfect candidate. Secondly, the content that primarily changes are the articles, like this one. Last, but not least, I want to give my site the fastest possible deliver in the most performant manner. 

Leading up to this switch I had always taken pride in my clean semantic markup and lean css. In fact, when it came time to inline my css in the "amp-custom" style tag (which has a limit of 50kb) I was pleasantly surprised that I was already under that threshold. 

My biggest bump in the road came in the form of mobile navigation. I previously had a nice off-canvas mobile nav solution that I have, since creation, reused on a number of projects. AMP does not allow author-written JavaScript or any third-party JS. So I immediately had a broken experience in mobile. Fortunately I had a free Sunday evening and rewrote the nav to be entirely HTML/CSS - which is nice.

On my TODO list are integration of AMP's modal/dialog boxes and playing with the carousels.

Lot's more to come - but the end result is a homepage that now loads in 563ms.

With that kind of speed I can't complain and neither will visitors to my site.




