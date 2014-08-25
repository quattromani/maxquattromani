---
layout: post
title:  "Vertical align an element with 3 lines of CSS"
sub-title: ""
date:   2014-07-25 10:17:10
categories: css
---

With just 3 lines of CSS (excluding vendor prefixes) we can with the help of transform: translateY  vertically center whatever we want, even if we don’t know its height.

The CSS property transform is usally used for rotating and scaling elements, but with its translateY function we can now vertically align elements. Usually this must be done with absolute positioning or setting line-heights, but these require you to either know the height of the element or only works on single-line text etc.

So, to do this we write:

--

In the broadest terms; <code>currentColor</code> is the equivalent of <code>inherit</code>. But alas, <code>inherit</code> does not work for something like this: 

{% highlight html %}
.parent-element {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.element {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
{% endhighlight %}

That’s all you need. It is a similar technique to the absolute-position method, but with the upside that we don’t have to set any height on the element or position-property on the parent. It works straight out of the box, even in IE9!

To make it even more simple, we can write it as a mixin with its vendor prefixes:

{% highlight html %}
@mixin vertical-align {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.element p {
  @include vertical-align;
}
{% endhighlight %}

Or you can use the Sass placeholder selector to reduce code bloat in the output CSS:

{% highlight html %}
%vertical-align {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.element p {
  @extend %vertical-align;
}
{% endhighlight %}

<h5>FIN</h5>
