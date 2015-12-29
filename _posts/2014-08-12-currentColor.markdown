---
layout: post
title:  "Start using currentColor in your CSS"
permalink: start-using-currentColor-in-your-css
sub-title: ""
date:   2014-08-12 12:07:13
categories: 
    - css
---

<code>currentColor</code> is a CSS variable-like feature that's been avaialble to developers for quite some time, but it goes unused and unknown - forced to live a life of obscurity.

Today I say "No more!"

--

In the broadest terms; <code>currentColor</code> is the equivalent of <code>inherit</code>. But alas, <code>inherit</code> does not work for something like this: 

{% highlight html %}
.link {
  color: #f00;
  
  &:hover {
    border-bottom: 1px solid inherit;
  }
}
{% endhighlight %}

No matter how much I want it to, this just won't work. But with <code>currentColor</code>, this does work:

{% highlight html %}
.link {
  color: #f00;
  
  &:hover {
    border-bottom: 1px solid currentColor;
  }
}
{% endhighlight %}


Go ahead and give it a try - make something awesome with it! 
